import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../context/AppProvider';
import { CartContext, CartContextType } from '../../context/CartProvider';
import {UserContext} from '../../context/UserProvider';
import './Order.scss';
import { Address } from '../../interfaces/User';
import UserAddress from './UserAddress'
import { ProductCart } from '../../interfaces/Products';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import RealmApp from '../../utils/mongodb';
import { refreshData } from '../../redux/User';
import { emptyCart, createOrder, OrderData } from '../../redux/Cart';

const Order: React.FC = () => {

    const [address, setAddress] = useState<Address>();
    const [creditCard, setCreditCard] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [ccv, setCcv] = useState("");
    const [nameOnCard, setNameOnCard] = useState("");
    const [products, setProducts] = useState<Partial<ProductCart>>();
    const [houseIndex, setHouseIndex] = useState(0);


    const app: Realm.App = RealmApp();
    
    const cart = useAppSelector(state => state.cart);
    
    const user = useAppSelector(state => state.user);
    let navigate = useNavigate();

    let currentUser: Realm.User = app.currentUser!;
    let addresses = user.addresses as Array<Address>;
    let customData = currentUser.customData;    

    let mongoDB = currentUser!.mongoClient("mongodb-atlas");
    let database = mongoDB.db("the-big-shop");
    let orderCollection = database.collection("orders");

    const dispatch = useAppDispatch();

    useEffect( () => {
        
        if( !user.isLoggedIn){
            navigate("/login");
        }
        try{
            let products = JSON.parse(localStorage.getItem("products") || '');
            
            setProducts(products);
        }catch(e){

        }

        if(!user.addresses){
            navigate("/user");
        }else{
            setAddress(addresses[0]);
        }
        
    }, [user]);


    const placeOrder = (e: React.UIEvent) => {
        e.preventDefault();
        
        const func = async () => {

            const orderData: OrderData = {
                userId: user.userId,
                address: address!,
                "credit-card": creditCard,
                "primary-phone": customData["primary-phone"] as string,
                "secondary-phone": customData["secondary-phone"] as string,
                "expiry-date": expiryDate,
                "name-on-card": nameOnCard,
                "products": products as ProductCart,
            };

            dispatch(createOrder(orderData))
            
            dispatch(refreshData());
            
            localStorage.setItem("products", "");
            dispatch(emptyCart(''));
            navigate('/thankyou');
        }
        func();
    }

    const handleAddress = (item: Address, index: number) => {
        console.log('item', item);
        setAddress(item);
        setHouseIndex(index);
    };

    return <>
    <div className="order-container">
        <h4>Select Addresses</h4>
        <div className='address-container'>        
            <UserAddress addresses={addresses} houseIndex={houseIndex} handleAddress={handleAddress}/>

            <h4>Total Price = {products && products["total"]}</h4>
        </div>

        <h4>Payment Details</h4>
        <form className='credit-card-form'>
            <div className="payment-item ">
                <label htmlFor="credit-card" >Card No</label>
                <input  id="credit-card" type="text" value={creditCard} onChange={(e) => setCreditCard(e.target.value)}/>
            </div>
            
            <div className='payment-item '>
                <label htmlFor="expiry-date" >Expiry Date</label>
                <input id="expiry-date" type="text" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}/>
            </div>
            
            <div className='payment-item '>
                <label htmlFor="ccv" >CCV</label>
                <input id="ccv" type="text" value={ccv} onChange={(e) => setCcv(e.target.value)} />
            </div>
            
            <div className='payment-item '>
                <label  htmlFor="name-on-card" >Name on Card</label>
                <input id="name-on-card" type="text"  value={nameOnCard} onChange={(e) =>setNameOnCard(e.target.value)}/>
            </div>

            <button className='button' onClick={placeOrder} > Place Order </button>
        </form>
    
        </div>
    </>;
}

export default Order;
