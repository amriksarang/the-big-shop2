import React , {useState, useEffect, HTMLAttributes} from 'react';
import {  useSearchParams } from "react-router-dom";
import { AppContext } from '../../context/AppProvider';
import { CartContext, CartContextType } from '../../context/CartProvider';
import {Link} from 'react-router-dom';
import './ProductDetail.scss';
import { Feature, Features, Position, ProductVarient, Products, Varients } from '../../interfaces/Products';
import { AppContextType } from '../../interfaces/AppInterfaces';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setItem } from '../../redux/Cart';
import RealmApp from '../../utils/mongodb';
import LargeImageContainer from '../../lib/image-magnifier/LargeImageContainer';
import MagnifierCanvas from '../../lib/image-magnifier/MagnifierCanvas';
import * as Realm1 from "realm-web";
import { getDatabase } from '../../utils/utils';

const ProductDetail: React.FC = () => {
    let selector: HTMLDivElement, 
        imageContainer: HTMLDivElement, 
        imageContainerRect: DOMRect, 
        imageContainerRectLeft: number, 
        imageContainerRectRight: number, 
        imageContainerRectTop: number, 
        imageContainerRectBottom: number,
        selectorWidth: number, 
        selectorHeight: number,
        magnifiedImageCanvas: HTMLImageElement;

    const [product, setProduct] = useState<Products>(null!);
    const [searchParams, setSearchParams] = useSearchParams();
    const [varients, setVarients] = useState<ProductVarient[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [position, setPosition] = useState<Partial<Position>>(null!);
    const [productNotFound, setProductNotFound] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [largeImage, setLargeImageSrc] = useState('');
    const [magnifiedImage, setMagnifiedImageSrc] = useState('');
    const app: Realm.App = RealmApp();

    const [mongoDB, setMongoDB] = useState<Realm.Services.MongoDB | undefined>(null!);

    // const cart: CartContextType = React.useContext(CartContext);

    const dispatch = useAppDispatch();

    useEffect(() => {
        async function restoreUser() {
           
            const database = await getDatabase(app);
            
            setMongoDB(database!);
        }
        restoreUser();

    }, []);


    useEffect( () => {
        
        const func = async () => {
            const id = searchParams.get("productId");

            if(!id) {
                setProductNotFound(true); 
                setIsLoading(false);
                return;
            } 

            let product = await mongoDB?.db("the-big-shop").collection("products").findOne({
                "product-id": parseInt(id)
            });
            
            if(!product && mongoDB) {                
                setProductNotFound(true); 
                setIsLoading(false);
                return;
            }

            if(product) setIsLoading(false);

            setProduct(product);
            
        }

        func();
    }, [mongoDB, searchParams]);

// varient.type, index1, {"type": varient.type, "id": item.id, "value": item.value, "price": item.price}
    const handleVarients = (type: string, index: number, varient: ProductVarient) => {

        let items = varients.reduce((prev: ProductVarient[], item: ProductVarient | undefined) => { //collect all other varients except this one
            if(item?.type !== varient.type)  prev.push(item!) ;        
            return prev;
        }, []);

        setPosition(position => ({...position, [type]: index}));
        // setVarients([...items, varient]);    //spread other varients and then add this one
    }


    useEffect(() => {
        
       let varientsList: ProductVarient[] = [];
       let varients: Varients[] | undefined = product?.varients;
       varients?.forEach((varient: Varients) => {
            varientsList.push({...varient["value"][0], type: varient["type"]}); //set default varients
       });
       
       setVarients([...varientsList]);
    },[product, setProduct]);

    
    useEffect(() => {
        
    }, [varients, setVarients]);

    const getFeatures = (features: Features) => {
        
        return Object.entries(features).map( ([key, value]) => <li key={key}>
            {`${key}: ${value}`}
        </li>)
    }

    const getVarients = (varients: Varients[]) => {
        
        return varients.map( (varient, index) => {
            
            let selectedVarient = position;
            if(!selectedVarient){
                selectedVarient = {[varient.type]: 0};
            }
           
            return <li key={varient.type} className="varient-list">
                        {`${varient.type}`}&nbsp;
                        {
                        varient.value.map((item, index1) => 
                            <span  key={item.id + item.value} className={selectedVarient[varient.type] === index1 ? "selected-varient" : "not-selected-varient"}
                                onClick={() => handleVarients(varient.type, index1, {"type": varient.type, "id": item.id, "value": item.value, "price": item.price})}>
                                &nbsp;&nbsp;{item.value} &nbsp;&nbsp;
                            </span>
                        )
                        }
                    </li>
        })
    }

    const handleProduct = () => {
        
        // cart.setItem(product, quantity, varients);
        dispatch(setItem({product, quantity, varient: varients}));
    }


    const ratingStyle = (): HTMLAttributes<string> => {
        let ratingStars = product.features.Rating;
        let startWidthPercentage = ratingStars * 100 / 5;
        let style = { "--width": `${startWidthPercentage}%` };
        return style as HTMLAttributes<string>;
    }
    
    const discountedPrice = () => {
        let mrp = parseInt(product.mrp.replace(",", ""));
        let discount = parseInt(product?.discount?.replace('%', '') || '0');
        
        return mrp - mrp * discount / 100;
    }

    const productDetailHtml = () => {
        return product.details.split("|").map(item => <li key={item}>{item}</li>);
    }

    const setLargeImage = (e: React.MouseEvent) => {
        // checkImageElementInitialization();
    
        let src = (e.target as HTMLImageElement).src.replace("thumb", "large");
    
        setLargeImageSrc(src)
        setMagnifiedImageSrc(src);
        
    }

    return <>
     {
        product && <>
            
            <div className="product-details-container">
                <div className='product-image-large'>
                    
                    <div className='product-thumbs'>
                        {
                            product.images.thumbs.map(thumb => <img key={thumb} src={thumb} onClick={setLargeImage} alt="thumbs"/>)
                        }
                    </div>
                    {/* <div onMouseMove={mouseoverSelectorPositionController} className="image-container" onMouseLeave={handleMouseLeave}>
                        <div className="mouseover-selector" ></div>
                        <img id="large-image" src={product.images.large[0]} alt="main"/>
                    </div> */}
                    <LargeImageContainer className='image-container' largeImageSrc={largeImage === '' ? product.images.large[0]: largeImage} />
                </div>
                <div className='product-details'>
                    {/* <div id="magnifier-canvas" className="magnifier-canvas"><img src={product.images.large[0]} id="magnified-image" alt="Magnified"/></div> */}
                    <MagnifierCanvas className='magnifier-canvas' magniFiedImageSrc={magnifiedImage === '' ? product.images.large[0]: magnifiedImage} />
                    <h3>{product["product-title"]}</h3>
                    <p><a href="#" className='product-detail-store'>Visit the {product.features["Brand"]} Store</a></p>
                    <div> <div className="product-ratings">
                        <div className="empty-stars">&nbsp;</div>
                        <div className="filled-stars" style={ratingStyle()}></div>
                    </div>&nbsp;{product.features["Reviews"]}&nbsp; ratings</div>
                    <p className='mrp-price' style={{'marginLeft': 0}}>MRP: Rs.{product.mrp}</p>
                    <p>Rs. {discountedPrice()} (less {product.discount})</p>
                    <p className='product-detail-features'>Features:</p>
                    <ul>
                        {getFeatures(product.features) }
                    </ul>
                    <p className='product-detail-select-option-text'>Select options</p>
                    <ul>
                        {getVarients(product.varients)}
                    </ul>
                    <p className='product-detail-text'>Details</p>
                    <ul className="product-detail-details">{productDetailHtml()}</ul>
                    <button className='product-detail-decrease-button' onClick={() => setQuantity( quantity => quantity > 1 ? quantity - 1 : 1) }> - </button> 
                    <span data-testid='quantity-elem'>{quantity}</span>
                    <button className='product-detail-increase-button' data-testid="increment" onClick={() => setQuantity( quantity => quantity + 1) }> + </button>
                    <button  className='button' onClick={handleProduct} data-testid="add-product">Add Product</button>
                    <Link to="/cart" className="button" data-testid="go-to-cart">Go to Cart</Link>
                </div>
            </div>
        </>
     }
     {
        productNotFound && <p style={{textAlign: "center", marginTop: "20px"}}>Product Not Found</p>
     }

    {
        isLoading && <p className='no-data-found-or-loading'><i className="spinner fa fa-spinner fa-spin"></i>&nbsp;Loading...</p>
    }
    
    </>

}

export default ProductDetail;
