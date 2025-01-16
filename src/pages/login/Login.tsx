import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { testEmail } from '../../utils/utils';
import {Link} from 'react-router-dom';
import { login } from '../../redux/User';
import './Login.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const Login: React.FC = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isLoginError, setIsLoginError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    let navigate = useNavigate();
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => {
        return state.user;
    });

    useEffect(() => {
        
        if( user.isLoggedIn){
                navigate("/");
        }
        if(user.isLoginError){
            setErrorMessage(user.errorMessage);
            setIsLoginError(true);
        }
    }, [user, navigate]);

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

    const loginUser = () => {

        if(invalidForm()){
            return;
        }
        
        dispatch(login({email, password}));
        
    };

    return (
      <><div className='login-container'>
        <label htmlFor="username" >Username</label>
        <input
            data-testid="username"
            id="username"
            type="text"
            value={email}
            onChange={(e) => {
                setEmail(e.target.value);
            }}
        />
        {emailError && <p className='error-field'>Please provide valid email</p>}

        <label htmlFor="password">Password</label>        
        <input
            data-testid='password'
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
                setPassword(e.target.value);
            }}
        />
        {passwordError && <p className='error-field'>Please enter password</p>}
        <button className='button' onClick={loginUser} data-testid='log-in'>Log In</button>
        {
            isLoginError && <p>{errorMessage}</p>
        }
        <p className="register-user">New User? Register <span className='register-here'><Link to="/register">here</Link></span></p>
        </div>
      </>
    );
}

export default Login;
