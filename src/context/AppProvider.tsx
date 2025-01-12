import React , {useState, useEffect} from 'react';
import * as Realm from "realm-web";
import { AppContextType, AppProviderProps } from '../interfaces/AppInterfaces';

export const AppContext = React.createContext<AppContextType>(null!);

export const AppProvider: React.FC<AppProviderProps> = ({appId, children}) => {
	
    const [app, setApp] = useState<Realm.App>(null!);
    const [user, setUser] = useState<Realm.User>(null!);

    useEffect(() => {
        setApp(null!);
      }, [appId]);
  
	
    useEffect(() => {
	        
        // const credentials: Realm.Credentials = Realm.Credentials.anonymous();

        // const anonymousLogin = async () => {           
        //     const currentUser: Realm.User = await app.logIn(credentials);
        //     setUser(currentUser);
        // }

        // anonymousLogin();
        
    }, [app]);

    return (
        <AppContext.Provider value={ {app, user}}>
            {children}
        </AppContext.Provider>
    );
}

