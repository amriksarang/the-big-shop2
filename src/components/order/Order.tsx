import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../context/AppProvider';
import { CartContext, CartContextType } from '../../context/CartProvider';
import {UserContext} from '../../context/UserProvider';
import './Order.scss';
import { Address } from '../../interfaces/User';
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
    // const cart: CartContextType = React.useContext(CartContext);
    const cart = useAppSelector(state => state.cart);
    // const user = React.useContext(UserContext);
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
        console.log('Order1');
        if( !user.isLoggedIn){
            console.log('Order2');
            navigate("/login");
        }
        try{
            setProducts(JSON.parse(localStorage.getItem("products") || ''));
        }catch(e){

        }

        if(!user.addresses){
            navigate("/user");
        }
        
    }, [user]);


    const placeOrder = (e: React.UIEvent) => {
        e.preventDefault();
        
        const func = async () => {
            console.log("calling realm");
            // await orderCollection.insertOne( 
            //     {
            //         userId: user.userId,
            //         address: address,
            //         "credit-card": creditCard,
            //         "primary-phone": customData["primary-phone"],
            //         "secondary-phone": customData["secondary-phone"],
            //         "expiry-date": expiryDate,
            //         "name-on-card": nameOnCard,
            //         "products": products
            //     }
            // );

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
            
            // await currentUser.refreshCustomData();
            dispatch(refreshData());
            
            localStorage.setItem("products", "");
            dispatch(emptyCart(''));
            // cart.emptyCart();
            navigate('/thankyou');
        }
        func();
    }

    const handleAddress = (item: Address, index: number) => {
        setAddress(item);
        setHouseIndex(index);
    };

    return <>
    <div className="order-container">
        <h4>Select Addresses</h4>
        <div className='address-container'>
        
            <ul>
            {
                addresses && addresses.map((item: Address, index: number) => {
                    
                    return  item && <li key={item._id} style={{border: houseIndex === index ? "2px solid brown " : "1px solid lightgrey"}}>
                        <input type="radio" checked={index === houseIndex} disabled/>
                        <div className='house-details'>
                            <p>{item.houseno}</p>
                            <p>{item.street1}</p>
                            {item.street2 && <p>{item.street2}</p>}
                            <p>{item.city}</p>
                            <p>{item.state}</p>
                            <p>{item.zipcode}</p>
                        </div>
                        <button className='button' onClick={() => handleAddress(item, index)} disabled={houseIndex === index ? true : false}>Select</button>
                    </li>
                })
            }
            </ul>

            
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
