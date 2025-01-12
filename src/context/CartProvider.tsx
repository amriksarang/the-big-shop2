import React, { useState, useEffect } from "react";
import {
	isPropertyNullOrUndefinedOrEmpty,
	convertStringToInt,
} from "../utils/utils";
import { ProductCart, CartItem, ProductVarient, Products } from "../interfaces/Products";

export interface CartProviderProps {
	children: React.ReactNode;
}

export interface CartContextType {
    setItem: (item: Products, quantity: number, varient: Array<ProductVarient>) => void;
    getItems: () => {};
    removeItem: (item: CartItem, varient: Array<ProductVarient>) => void;
    emptyCart: () => void;
}

const cartInitialValue = {products: [], total: 0};

export const CartContext = React.createContext<CartContextType>(null!);
// exportconst UserContext = React.createContext<partial<user>>({});
/* 
{
    "id1" : {
        id: "id1",
        quantity: 1
    },
    "id2":{
        id: "id2",
        quantity: 2
    }
}
*/

export const CartProvider: React.FC<CartProviderProps> = ({
	children,
}) => {
	const [cart, setCart] = useState<ProductCart>(cartInitialValue);
	const [localStorageNotEmpty, setLocalStorageNotEmpty] = useState(false);

	const objectEqual = (obj1: any, obj2: any) => {
		return Object.keys(obj1).every((key) => {
			if (
				!isPropertyNullOrUndefinedOrEmpty(obj2, key) &&
				obj1[key] === obj2[key]
			) {
				return true;
			} else if (obj2[key] === 0 && obj1[key] === 0) {
				return true;
			} else if (
				isPropertyNullOrUndefinedOrEmpty(obj1, key) &&
				isPropertyNullOrUndefinedOrEmpty(obj2, key)
			) {
				return true;
			}
			return false;
		});
	};

	const isSameVarients = (item1: Array<ProductVarient>, item2: Array<ProductVarient>) => {
		return item1.every((item) => {
			return item2.some((item3) => {
				return objectEqual(item, item3);
			});
		});
	};

	const filteredProducts = (products: Array<CartItem>, product: Products, quantity: number, varient: Array<ProductVarient>) => {
		return products.filter((item: CartItem) => {
			if (item["product"]["product-id"] !== product["product-id"]) {
				return true;
			}
			if (isSameVarients(item["varient"], varient)) {
				return false;
			} else {
				return true;
			}
		});
	};
    	
	const calculateTotal = (filteredProducts: Array<CartItem>): number => {
		let a = filteredProducts.reduce((prev, item) => {
			return prev + item["productPrice"];
		}, 0);
		return a;
	};

    	/*
    useEffect(() => {
        if(!cart || Object.keys(cart).length === 0){
            let data = localStorage.getItem("products");
            let products;

            try{
                products = JSON.parse(data);
            }catch{

            }
            
            if(products && Object.keys(products).length > 0) {
                setLocalStorageNotEmpty(true);
            }else{
                setLocalStorageNotEmpty(false);
            }
        }
    }, []);*/

    useEffect(() => {
		if (!cart || Object.keys(cart).length === 0) {
			let data = localStorage.getItem("products");

			let products;
			try {
				products = JSON.parse(data || '');
			} catch (e) {}

			if (products && Object.keys(products).length > 0) {
				setLocalStorageNotEmpty(true);
			} else {
				setLocalStorageNotEmpty(false);
			}
		} else {
			localStorage.setItem("products", JSON.stringify(cart));
			window.dispatchEvent(new Event("storage"));
		}
	}, [cart, setCart]);

	useEffect(() => {
		let items = localStorage.getItem("products");
		let itemsParsed;
		try {
			itemsParsed = JSON.parse(items || '');
			setCart(itemsParsed);
		} catch (e) {
			setCart(cartInitialValue);
		}
	}, [localStorageNotEmpty, setLocalStorageNotEmpty]);




	const getItems = (): ProductCart => {
        return cart;
	};

	const setItem = (product: Products, quantity: number, varient: ProductVarient[]) => {
		let varientCost = varient.reduce((prev, item) => {
			if (isPropertyNullOrUndefinedOrEmpty(item, "price")) {
				return prev;
			}
			return convertStringToInt(item.price || 0) + prev;
		}, 0);

		let mrp: number = convertStringToInt(product.mrp);

		let productPrice: number = (mrp + varientCost) * quantity;

		setCart((products: ProductCart) => {
			if (
				!products ||
				Object.keys(products).length === 0 ||
				products["products"]?.length === 0
			) {
				return {
					products: [{ product, quantity, varient, productPrice }] as CartItem[],
					total: productPrice,
				};
			}
			let filteredProductsList = filteredProducts(
				products["products"]!,
				product,
				quantity,
				varient
			);

			return {
				products: [
					...filteredProductsList,
					{ product, quantity, varient, productPrice },
				],
				total: calculateTotal(filteredProductsList) + productPrice,
			};
		});
	};



	const removeItem = (item: CartItem, varient: Array<ProductVarient>) => {
		let filteredProducts = cart!["products"].filter((product: CartItem) => {
			if (
				product["product"]["product-id"] ===
				item["product"]["product-id"]
			) {
				if (isSameVarients(product["varient"], varient)) {
					return false;
				}

				return true;
			}
			return true;
		});

		setCart({
			products: filteredProducts,
			total: calculateTotal(filteredProducts),
		});
	};

	const emptyCart = () => {
		setCart(cartInitialValue);
	};

	return (
		<CartContext.Provider
			value={{ setItem, getItems, removeItem, emptyCart }}
		>
			{children}
		</CartContext.Provider>
	);
};
