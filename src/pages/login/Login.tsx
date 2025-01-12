import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from '../../context/AppProvider';
import * as Realm from "realm-web";
import { UserContext } from '../../context/UserProvider';
import {handleAuthenticationError, testEmail} from '../../utils/utils';
import { AppContextType } from '../../interfaces/AppInterfaces';
import { UserContextType } from '../../interfaces/User';
import {Link} from 'react-router-dom';
import { login } from '../../redux/User';
import './Login.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import RealmApp from '../../utils/mongodb';

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
    // const appContext: Partial<AppContextType> = React.useContext(AppContext)

    // const userContext: Partial<UserContextType> = React.useContext(UserContext);

    useEffect(() => {
        console.log('user in login', user);
        if( user.isLoggedIn){
            if (window.history.length > 1) {
                navigate(-1); 
              } else {
                navigate("/");
              }
        }
    }, [user]);

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
            console.log('invalid', email, password);
            console.log('email', email);
            return;
        }
        
        dispatch(login({email, password}));
        // try{
        //     const credentials = Realm.Credentials.emailPassword(email, password);
        //     app?.logIn(credentials)
        //                 .then( result => {
        //                     (userContext as UserContextType).setIsUserLoggedIn(true);
        //                     navigate(-1);
        //                 })
        //                 .catch( (error: Realm.MongoDBRealmError) => {                            
        //                     let errorMsg = handleAuthenticationError(error);                            
        //                     setErrorMessage(errorMsg);
        //                     setIsLoginError(true);
        //                 });        
            
        // }catch(e){            
        //     console.log(e);
        // }
        
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
                console.log("target email", e.target.value)
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
                console.log('target pass', e.target.value);
                setPassword(e.target.value);
            }}
        />
        {passwordError && <p className='error-field'>Required Field</p>}
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
