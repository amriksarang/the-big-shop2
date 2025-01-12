import React , {useEffect, useState} from 'react';
import { AppContext } from './AppProvider';
import { AppContextType } from '../interfaces/AppInterfaces'
import { UserContextType, UserProviderProps } from '../interfaces/User';


export const UserContext = React.createContext<UserContextType>(null!);

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [user, setUser] = useState<Realm.User>(null!);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    const context: AppContextType = React.useContext(AppContext);
	const app = context.app;
	const contextUser = context.user;

    useEffect(() => {
		setUser(contextUser);
        if(app?.currentUser?.providerType === "local-userpass"){
            setIsUserLoggedIn(true);
        }else{
            setIsUserLoggedIn(false);
        }
    }, [contextUser]);
	

    return (
        <UserContext.Provider value={ {user, setUser, isUserLoggedIn, setIsUserLoggedIn}}>
            {children}
        </UserContext.Provider>
    );
}
