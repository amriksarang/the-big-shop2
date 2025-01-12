export interface Address{
    houseno: string,
    street1: string,
    street2: string,
    city: string,
    state: string,
    country: string,
    zipcode: string,
    _id: any
}

export interface User{
    email: string,
    firstname: string,
    lastname: string,
    'primary-phone': string,
    'secondary-phone': string,
    userId: string,
    _id: string,
    addresses: Address[]
}

export interface UserContextType{
    user: Realm.User,
    setUser: any,
    isUserLoggedIn: boolean,
    setIsUserLoggedIn: (u: boolean) => void
}

export interface UserProviderProps{
    children: React.ReactElement
}

export type GeneralObject<T> = {
    [P in keyof T]: T[P]
}
