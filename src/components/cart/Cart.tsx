import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCart, CartItem, ProductVarient } from '../../interfaces/Products';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { removeItem, setItem } from '../../redux/Cart';
import CartProductList from './CartProductList';
import './Cart.scss';

const Cart = () => {
    
    const [ products, setProducts] = useState<ProductCart | undefined>();

    const cart = useAppSelector(state => state.cart);
    const dispatch = useAppDispatch();

    useEffect( () => { 
        if(cart.products)
            setProducts(cart.products);
        
    }, [cart]);


    const handleProducts: any = (item: CartItem, quantity: number, varient: Array<ProductVarient>): void => {
       
        if(quantity === 0){
            dispatch(removeItem({item, varient}));
        }else{  
            dispatch(setItem({product: item["product"], quantity, varient}))
        }    
    }

    const deleteItem: any = (item: CartItem, varient: Array<ProductVarient>) => {
        dispatch(removeItem({item, varient}));
    }

    return <>
        <h2 className='shopping-cart-title'>Shopping Cart</h2>
        <div className='shopping-cart-container'>
        <CartProductList products={products} handleProducts={handleProducts} deleteItem={deleteItem} />
        
        {   products && products["products"] && products["products"].length > 0 && <>
            <h4 className='cart-product-total'>Total Price = {products?.total}</h4>
            <p className='cart-payment-details'><Link to="/order"><button className='button' onClick={() => {}}  >Payment Details</button></Link></p>
            </>
        }

        
        {
            (!products || !products["products"] || products["products"].length === 0) && <p style={{textAlign: "center"}}>Your cart is empty</p>
        }
        </div>
        
    </>;

}

export default Cart;
