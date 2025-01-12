import React, { HTMLAttributes, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import SearchTool from "../../components/search-tool/SearchTool";
import QueryBuilder from "../../utils/QueryBuilder";

import { AppContext } from "../../context/AppProvider";
import { UserContext } from "../../context/UserProvider";

import "./products.scss";
import { ProductImages, SearchData } from "../../interfaces/Products";
import { Products } from "../../interfaces/Products";
import RealmApp from '../../utils/mongodb';
import * as Realm1 from "realm-web";
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { resolve } from "path";
import { getDatabase } from "../../utils/utils";

const ProductsList: React.FC = () => {

	const [productsList, setProductsList] = useState<Partial<Array<Products>>>([]);
	const [noDataFound, setNoDataFound] = useState<Boolean>(false);
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [searchData, setSearchData] = useState<SearchData[]>(null!);
	const [searchParams, setSearchParams] = useSearchParams();
	const [mongoDB, setMongoDB] = useState<Realm.Services.MongoDB>(null!);

	const context: any = React.useContext(AppContext);
	// const userContext: any = React.useContext(UserContext);

	// [ { features: "Camera" , value: "20 - 40"} ,  { features: "Camera" , value: "40 - 60"} , { { features: "RAM" , value: 20} }]

    
    const app = RealmApp();
    
    const user = useAppSelector(state => {
        return state.user;
    });

	const mergeQueriesData = () => {
		const mergedQueriesData: Array<{features: string, values: (string | number)[]}> = [];
		// [ {features: "Camera", values: ["20 - 40", "60 - 80"] } , { features: "RAM" , values: [8, 12] } , { features: "Brand", values:["Samsung", "Oneplus"]} ]
		/*
            db.products.aggregate([
                    {$match:    { $and: [
                                        {$or: [
                                                { "features.Camera": {$gte : 20, $lte: 40} }, 
                                                { "features.Camera": {$gte : 60, $lte: 80} }
                                            ]
                                        },
                                        {$or: [
                                                { "features.RAM": { $elemMatch: { $eq: 8} } },
                                                { "features.RAM": { $elemMatch: { $eq: 12} } }
                                            ]
                                        },
                                        {$or: [
                                                { "features.Brand": {$eq: "Samsung"} },
                                                { "features.Brand": {$eq: "OnePlus"} }
                                            ]
                                        }
                                    ]
                                }
                    },
                { $skip: 1 },
                { $limit: 2 }
                    
            ])
        */
		searchData?.forEach((item) => {
			let data = mergedQueriesData.find(
				(field) => field.features === item.features
			);
			if (data) {
				data.values.push(item.value);
			} else {
				mergedQueriesData.push({
					features: item.features,
					values: [item.value],
				});
			}
		});
		let query = new QueryBuilder(
			mergedQueriesData,
			searchParams.get("search")
		).getQuery();

		return query;
	};

    useEffect(() => {
        async function restoreUser() {
           
            const database = await getDatabase(app);
            
            setMongoDB(database!);
        }
        restoreUser();

    }, []);

	useEffect(() => {
		let query = mergeQueriesData();
        
		const getProducts = async () => {
			console.log("calling realm");
			const productsCollection = mongoDB?.db("the-big-shop")
				.collection("products");
            setIsLoading(true);
            setProductsList([]);
            setNoDataFound(false);
            
			const products: Array<Products> = await productsCollection.aggregate(query);
			if (!products || products.length === 0) {
				setNoDataFound(true);
			} else {
				setNoDataFound(false);
			}
            
			setProductsList(products);
		};
        
		mongoDB && getProducts();
	}, [searchData, mongoDB, searchParams]);

	useEffect(() => {
		if (productsList.length > 0 || ((productsList as Array<Products>).length === 0 && noDataFound)) setIsLoading(false);
	}, [productsList, setProductsList]);

	const clearSearch = () => {
		setSearchParams("");
	};

	const getProducts = () => {
		return productsList.map((productItem: Products | undefined) => {
            
            let product = productItem!;
            let discountValue = product.discount || '';
            let mrp = parseInt(product.mrp.replace(",", ""));
            let discount = parseInt(discountValue.replace("%", ""));
            let discountedPrice = mrp - (mrp * discount) / 100;
            let ratingStars = product.features.Rating;
            let startWidthPercentage = (ratingStars * 100) / 5;
            let style = { '--width': `${startWidthPercentage}%` };

            return (
                <Link
                    to={`/product?productId=${product["product-id"]}`}
                    key={product["product-title"]}
                >
                    <div className="product">
                        <img
                            src={product.images.small}
                            alt={product["product-title"]}
                        />
                        <div className="discounted-price">
                            ₹ {discountedPrice}&nbsp;
                        </div>
                        <div className="mrp-price">₹ {product.mrp}</div>
                        <div className="product-title">
                            {product["product-title"]}
                        </div>
                        <div className="product-ratings">
                            <div className="empty-stars">&nbsp;</div>
                            <div className="filled-stars" style={style as HTMLAttributes<string>}></div>
                        </div>
                        <div className="rating-reviews">
                            ({product.features.Reviews})
                        </div>
                    </div>
                </Link>
            );
            
		});
	};

	return (
		<>
			{searchParams.get("search") && (
				<p className="search-text">
					You searched for {searchParams.get("search")}.{" "}
					<button onClick={clearSearch} className="search-button">
						x Clear
					</button>
				</p>
			)}
			{
				<div className="products-container">
					{<SearchTool setSearchData={setSearchData} />}
					{/*<Link to="/product?productId=14">ProductName</Link>*/}
					<div className="products-list">
						{isLoading && (
							<p
								className="no-data-found-or-loading"
								style={{ textAlign: "center" }}
							>
								<i className="spinner fa fa-spinner fa-spin"></i>
								&nbsp;Loading...
							</p>
						)}
						{noDataFound && (
							<p className="no-data-found-or-loading">
								No results found, please try a different search
							</p>
						)}
						{productsList &&
							productsList.length > 0 &&
							getProducts()}
					</div>
				</div>
			}
		</>
	);

	/*
	return productsList.length > 0 && <ul className="products-list">
	{productsList.map( item => <li  key={item["product-title"]}>{item["product-title"]}</li>)}
	</ul>
	*/
};

export default ProductsList;
