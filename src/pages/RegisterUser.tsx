import React, { useState, useEffect } from 'react';
import { testEmail} from '../utils/utils';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { registerUser } from '../redux/User';

import './login/Login.scss';

const RegisterUser: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    const { errorMessage: registerError, registerationSuccess } = user;

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

    const clearForm = () => {
        setEmail('');
        setPassword('');
    }

    useEffect(() => {
        if(registerationSuccess){
            clearForm();
        }
    }, [registerationSuccess]);

    const handleClick = async (event: React.UIEvent) => {
        if(invalidForm())
            return;
        
        await dispatch(registerUser({email, password}));
    };

    return <>
    
    <div className='login-container'>
        { registerationSuccess && 
                <p className='register-success'>Registeration successful, please click here to 
                    &nbsp;<a href='/login' className='register-login-link'>login</a>
                </p>}
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
        {passwordError && <p className='error-field'>Password is required</p>}
        <button className='button' onClick={handleClick}>Register</button>
        {
            registerError && <p className='register-error-field'>{registerError}</p>
        }
        
    </div>
    
    </>
}

export default RegisterUser;
