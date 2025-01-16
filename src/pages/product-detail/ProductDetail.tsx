import React , {useState, useEffect, HTMLAttributes} from 'react';
import {  useSearchParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Position, ProductVarient, Products, Varients } from '../../interfaces/Products';
import { useAppDispatch } from '../../redux/hooks';
import { setItem } from '../../redux/Cart';
import RealmApp from '../../utils/mongodb';
import LargeImageContainer from '../../lib/image-magnifier/LargeImageContainer';
import MagnifierCanvas from '../../lib/image-magnifier/MagnifierCanvas';
import { getDatabase } from '../../utils/utils';
import BasicProductDetails from './BasicProductDetails';
import ProductQuantityControlsParameters from './ProductQuantityControls'
import ProductFeatures from './ProductFeatures';
import ProductVarients from './ProductVarients';
import './ProductDetail.scss';

const ProductDetail: React.FC = () => {

    const [product, setProduct] = useState<Products>(null!);
    const [searchParams] = useSearchParams();
    const [varients, setVarients] = useState<ProductVarient[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [position, setPosition] = useState<Partial<Position>>(null!);
    const [productNotFound, setProductNotFound] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [largeImage, setLargeImageSrc] = useState('');
    const [magnifiedImage, setMagnifiedImageSrc] = useState('');
    const app: Realm.App = RealmApp();

    const [mongoDB, setMongoDB] = useState<Realm.Services.MongoDB | undefined>(null!);

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
                    <LargeImageContainer className='image-container' largeImageSrc={largeImage === '' ? product.images.large[0]: largeImage} />
                </div>
                <div className='product-details'>
                    <MagnifierCanvas className='magnifier-canvas' magniFiedImageSrc={magnifiedImage === '' ? product.images.large[0]: magnifiedImage} />
                    <BasicProductDetails product={product} discountedPrice={discountedPrice} ratingStyle={ratingStyle}/>
                    <p className='product-detail-features'>Features:</p>
                    <ProductFeatures features={product.features} />
                    
                    <p className='product-detail-select-option-text'>Select options</p>
                    <ProductVarients varients={product.varients} position={position} handleVarients={handleVarients}/>
                    <p className='product-detail-text'>Details</p>
                    <ul className="product-detail-details">{productDetailHtml()}</ul>
                    <ProductQuantityControlsParameters quantity={quantity} setQuantity={setQuantity} handleProduct={handleProduct} />
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
