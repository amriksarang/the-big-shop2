import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchTool from "../../components/search-tool/SearchTool";
import QueryBuilder from "../../utils/QueryBuilder";
import { SearchData } from "../../interfaces/Products";
import { Products } from "../../interfaces/Products";
import RealmApp from '../../utils/mongodb';
import { getDatabase } from "../../utils/utils";
import ProductsListItems from "./ProductsListItems";
import "./products.scss";

const ProductsList: React.FC = () => {

	const [productsList, setProductsList] = useState<Partial<Array<Products>>>([]);
	const [noDataFound, setNoDataFound] = useState<Boolean>(false);
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [searchData, setSearchData] = useState<SearchData[]>(null!);
	const [searchParams, setSearchParams] = useSearchParams();
	const [mongoDB, setMongoDB] = useState<Realm.Services.MongoDB>(null!);

	// [ { features: "Camera" , value: "20 - 40"} ,  { features: "Camera" , value: "40 - 60"} , { { features: "RAM" , value: 20} }]

    
    const app = RealmApp();

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
	}, [productsList, setProductsList, noDataFound]);

	const clearSearch = () => {
		setSearchParams("");
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
							<ProductsListItems productsList={productsList}/>}
					</div>
				</div>
			}
		</>
	);
};

export default ProductsList;
