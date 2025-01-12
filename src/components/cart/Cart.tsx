import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCart, CartItem, ProductVarient } from '../../interfaces/Products';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { removeItem, setItem } from '../../redux/Cart';
import './Cart.scss';

const Cart = () => {
    
    const [ products, setProducts] = useState<ProductCart>();

    const cart = useAppSelector(state => state.cart);
    const dispatch = useAppDispatch();

    useEffect( () => { 
        if(cart.products)
            setProducts(cart.products);
        
    }, [cart]);


    const handleProducts: Function = (item: CartItem, quantity: number, varient: Array<ProductVarient>): void => {
       
        if(quantity === 0){
            dispatch(removeItem({item, varient}));
        }else{  
            dispatch(setItem({product: item["product"], quantity, varient}))
        }    
    }

    const deleteItem = (item: CartItem, varient: Array<ProductVarient>) => {
        dispatch(removeItem({item, varient}));
    }

    return <>
        <h2 className='shopping-cart-title'>Shopping Cart</h2>
        <div className='shopping-cart-container'>
        
        <ul>
           
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

        </ul>
        {   products && products["products"] && products["products"].length > 0 && <>
            <h4 className='cart-product-total'>Total Price = {products?.total}</h4>
            <p className='cart-payment-details'><Link to="/order"><button className='button' >Payment Details</button></Link></p>
            </>
        }

        
        {
            (!products || !products["products"] || products["products"].length === 0) && <p style={{textAlign: "center"}}>Your cart is empty</p>
        }
        </div>
        
    </>;

}

export default Cart;
