import React, {useEffect, useState} from 'react';
import { Link, useNavigate, NavLink, NavigateFunction } from 'react-router-dom';
import { CartItem } from '../../interfaces/Products';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { loginAnonymous, logout } from '../../redux/User';
import { ReactComponent as Facebook } from '../../assets/img/header/facebook.svg';
import { ReactComponent as Instagram } from '../../assets/img/header/instagram.svg';
import { ReactComponent as Twitter } from '../../assets/img/header/twitter.svg';
import { ReactComponent as Pinterest } from '../../assets/img/header/pintrest.svg';
import { ReactComponent as Cart } from '../../assets/img/header/cart.svg';
import { ReactComponent as Search } from '../../assets/img/header/search.svg';
import { ReactComponent as Hamburger } from '../../assets/img/header/hamburger.svg';
import { ReactComponent as Login } from '../../assets/img/header/login.svg';
import './header.scss';

const Header: React.FC = () => {

    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const dispatch = useAppDispatch();

    const cart = useAppSelector(state => state.cart);

    const navigate: NavigateFunction = useNavigate();

    const user = useAppSelector(state => {
        return state.user;
    });


    useEffect(() => {
        
        if(user.isLoggedIn)
            setIsUserLoggedIn(user.isLoggedIn);
        else {
            setIsUserLoggedIn(false);
            dispatch(loginAnonymous());
        }
    }, [user, dispatch]);
    

    const getNoOfCartItems = (): number => {
        let items: CartItem[] = cart.products?.products;
        return items ? items.length : 0;
    }

    const handleClick = () => {

        if(searchTerm.trim().length === 0)
            return;

        if(!searchTerm.match(/^[A-Za-z0-9\s]+$/)){
            return;
        }

        navigate("/mobiles?search="+searchTerm);
    }

    const handerEnterKeyInInputField = (e: React.KeyboardEvent): void => {
        if(e.key === 'Enter') {
            handleClick();        
        }
    }

    const  handleLogout = async (event: React.MouseEvent<HTMLSpanElement, MouseEvent>): Promise<any> => {
        await dispatch(logout());
        navigate('/login');
    }

    return (<>
        <nav>
            <div className="nav">
                <Hamburger/>
                <ul className="search">
                    <li>                        
                        <Search />             
                    </li>
                    <li><input onKeyDown={handerEnterKeyInInputField} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" name="search" className="search-box" placeholder="Mobile Search Only..." required pattern=".*\S.*"/></li>
                </ul>
                <Link to="/"><img src="img/logo.png" alt="logo"/></Link>
                <ul className="social">
                    <li><Facebook/></li>
                    <li><Instagram/></li>
                    <li><Twitter/></li>
                    <li><Pinterest/></li>
                    <li style={{marginLeft: 'auto'}}>
                        <ul className="user-login">

                            <li>
                                <Link to="/cart">
                                    <Cart/>
                                </Link>
                                { getNoOfCartItems() > 0 ? `(${getNoOfCartItems()})`: ""}
                            </li>
                        
                            <li>
                                {
                                    isUserLoggedIn && <>	
                                    <span className='logout-link' onClick={handleLogout}>Log Out</span>	
                                    <Link to="/user">	                
                                        <Login/>             
                                    </Link>
                                    </>
                                }
                                
                                {
                                    !isUserLoggedIn && <>
                                        <Link to="/login"><span className="login-text">Log In / Register</span></Link>                                  
                                    </>
                                }
                                
                            </li>                        
                        
                            
                        </ul>
                    </li>
                </ul>
            </div>
                    
    </nav>
    <nav>
        <ul className="nav-links">
            <li>All</li>
            <li>Offers</li>
            <li>Grocery</li>
            <li><NavLink to="/mobiles"><span className="highlight-mobile">Mobiles</span></NavLink></li>
            <li>Fashion</li>
            <li>Electronics</li>
            <li>Appliances</li>
        </ul>
    </nav>
    </>
    );
}

export default Header;
