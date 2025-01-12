import {
	isPropertyNullOrUndefinedOrEmpty,
	convertStringToInt,
} from "../utils/utils";
import { CartData } from './Cart';
import { CartItem, ProductVarient } from "../interfaces/Products";

export const calculateProductPrice = (cartData: CartData) => {
    const { product, quantity, varient } = cartData;

    let varientCost = varient.reduce((prev, item) => {
        if (isPropertyNullOrUndefinedOrEmpty(item, "price")) {
            return prev;
        }
        return convertStringToInt(item.price || 0) + prev;
    }, 0);

    let mrp: number = convertStringToInt(product.mrp);

    let productPrice: number = (mrp + varientCost) * quantity;

    return productPrice;
}
export const removeProducts = (products: Array<CartItem>, data: any) => {
    const { item, varient} = data;
    return products.filter((product: CartItem) => {
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
}

export const filteredProducts = (products: Array<CartItem>, data: any) => {
    const {product, varient} = data;
    return products?.filter((item: CartItem) => {
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

const isSameVarients = (item1: Array<ProductVarient>, item2: Array<ProductVarient>) => {
    return item1.every((item) => {
        return item2.some((item3) => {
            return objectEqual(item, item3);
        });
    });
};

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

export const calculateTotal = (filteredProducts: Array<CartItem>): number => {
    let a = filteredProducts.reduce((prev, item) => {
        return prev + item["productPrice"];
    }, 0);
    return a;
};

