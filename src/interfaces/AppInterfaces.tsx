export interface AppProviderProps{
    appId: string,
    children: React.ReactNode
}

export interface AppContextType {
    app: Realm.App,
    user: Realm.User
}
