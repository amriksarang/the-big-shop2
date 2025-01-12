import * as Realm from "realm-web";

const REALM_APP_ID: string = "the-big-shop-poikl";

const RealmApp = () => {
    let app: Realm.App = null!;
    return () => {
        if(!app){
            app = new Realm.App({ id: REALM_APP_ID });
        }

        return app;   
    } 
}

export default RealmApp();
