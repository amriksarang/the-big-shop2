import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductsList from './pages/products-list/ProductsList';
import RegisterUser from './pages/RegisterUser';
import UserData from './pages/user-data/UserData';
import Login from './pages/login/Login';
import Logout from './pages/Logout';
import ProductDetail from './pages/product-detail/ProductDetail';
import Order from './pages/order/Order';
import Cart from './components/cart/Cart';
import App from './App';
import LandingPage from './pages/landing-page/LandingPage';
import Footer from './components/footer/footer';
import ThankYou from './pages/thank-you/ThankYou';


const AppRoutes = () => (
    <BrowserRouter>
            <App/>
            <Routes>
                
                <Route path="/" element={<LandingPage/>}/>
                {/*<Route exact path="/upload-products" element={<UploadProducts/>}/> */}
                
                {<Route path="/mobiles" element={<ProductsList/>}/>}
                <Route path="/register" element={<RegisterUser/>}/>
                <Route path="/user" element={<UserData/>}/>
                <Route path="/product" element={<ProductDetail/>}/>
                <Route path="/cart" element={<Cart/>}/>
                <Route path="/order" element={<Order/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/logout" element={<Logout/>}/>
                <Route path="/thankyou" element={<ThankYou/>}/>
            </Routes>
            <Footer/>
    </BrowserRouter>
)

export default AppRoutes;
