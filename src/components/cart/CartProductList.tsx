import React, {ReactElement} from 'react';
import { ProductCart, CartItem, ProductVarient } from '../../interfaces/Products';

interface CartProductListArguments{
    products: ProductCart | undefined, 
    handleProducts: (item: CartItem, quantity: number, varient: Array<ProductVarient>) => {}, 
    deleteItem: (item: CartItem, varient: Array<ProductVarient>) => {}
}

const CartProductList: React.FC<CartProductListArguments> = ({products, handleProducts, deleteItem}) : ReactElement => {
    return <ul>
    {   
        products && products["products"] && products["products"].map((item, index) => 
        <li className="cart-product-item" key={item["product"]["product-title"] + index}>
            <img  className='cart-product-image' src={item["product"]["images"]["small"]} alt=""/>
            <div className="cart-product-details">
                <h4>{item["product"]["product-title"]}</h4>
                <ul>
                {item["varient"].map( varient => {     
                    
                    return  <li className='cart-product-varient' key={varient.type}>{varient.type}: {varient.value} : Price Rs.{ !varient.price ? 0 : varient.price}</li>;
                })}
                </ul>
                <p className='cart-item-price'>MRP - Rs. {item["product"].mrp}</p>
                <button className='product-detail-decrease-button' onClick={() => handleProducts(item, item["quantity"] - 1, item["varient"])}> - </button> {item["quantity"]} 
                <button className='product-detail-increase-button' onClick={() => handleProducts(item, item["quantity"] + 1, item["varient"])}> + </button>
                <button className='button' onClick={() => deleteItem(item, item["varient"])}>Delete</button>
            </div>
        </li>
        )
    }

    </ul>;

}
export default CartProductList;
