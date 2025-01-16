import React, { useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logout } from '../redux/User';

const Logout: React.FC = () => {

    let navigate = useNavigate();

    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);

    useEffect(() => {
        
        if(!user.isLoggedIn){
            
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
       dispatch(logout());
    }, []);

    return null;
}

export default Logout;
