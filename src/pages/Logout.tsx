import React, { useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppProvider';
import {UserContext} from '../context/UserProvider';
import { AppContextType } from '../interfaces/AppInterfaces';
import { UserContextType } from '../interfaces/User';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logout } from '../redux/User';

const Logout: React.FC = () => {

    let navigate = useNavigate();
    // const appContext: AppContextType = React.useContext(AppContext);
    // const userContext: UserContextType = React.useContext(UserContext);
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);

    useEffect(() => {
        
        if(!user.isLoggedIn){
            
            navigate('/login');
        }
    }, [user])

    useEffect(() => {
       dispatch(logout());
    }, []);

    return null;
}

export default Logout;
