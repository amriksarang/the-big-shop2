import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import * as Realm from 'realm-web';
import { AppContext } from '../context/AppProvider';
import {handleAuthenticationError, testEmail} from '../utils/utils';
import { AppContextType } from '../interfaces/AppInterfaces';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { registerUser } from '../redux/User';
import RealmApp from '../utils/mongodb';

const RegisterUser: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isRegisterError, setIsRegisterError] = useState(false);

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [registerStatus, setRegisterStatus] = useState(false);

    const appContext: AppContextType = React.useContext(AppContext);
    const app = RealmApp();
    let navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    const { errorMessage: registerError, isLoggedIn } = user;
    

    useEffect(() => {
        if(isLoggedIn)
            navigate('/user');
    }, [isLoggedIn]);

    useEffect(() => {
        if(registerStatus && !registerError) navigate('/login');
    }, [registerStatus, registerError]);

    const invalidForm = () => {
        
        let isError = false;
    
        if(!testEmail(email)){
            setEmailError(true);
            isError = true;
        }else{
            setEmailError(false);
        }
    
        if(password.trim().length === 0){
            setPasswordError(true);
            isError = true;
        }else{
            setPasswordError(false);
        }
    
        return isError;
    }

    const handleClick = async (event: React.UIEvent) => {

        if(invalidForm())
            return;

        
        setRegisterStatus(false);
        await dispatch(registerUser({email, password}));
        setRegisterStatus(true);
        // app.emailPasswordAuth.registerUser({email, password} )
        //     .then(() => {
        //         navigate("/user");
        //     })
        //     .catch((error: Realm.MongoDBRealmError) => {
        //         let errorMsg = handleAuthenticationError(error);                
        //         setErrorMessage(errorMsg);
        //         setIsRegisterError(true);
        //     })
        
    };

    return <>
    <div className='login-container'>
        <label htmlFor="username" >Username</label>
        <input
            id="username"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p className='error-field'>Incorrect email pattern</p>}
        <label htmlFor="password">Password</label>
        <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <p className='error-field'>Required Field</p>}
        <button className='button' onClick={handleClick}>Register</button>
        {
            registerError && <p className='error-field'>{registerError}</p>
        }
    </div>
    
    </>
}

export default RegisterUser;
