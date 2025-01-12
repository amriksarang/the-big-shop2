import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../context/AppProvider';
import FormEditor from './FormEditor';
import './UserData.scss';
import { AppContextType } from '../../interfaces/AppInterfaces';
import { GeneralObject, User } from '../../interfaces/User';
import RealmApp from '../../utils/mongodb';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateAddress, updateUserDetails} from '../../redux/User';

const addressKeys = {
    "houseno": "House No",
    "street1" : "Street 1",
    "street2" : "Street 2",
    "city" : "City",
    "state": "State"
}

const personalDetailsKeys = {
    "firstname": "First Name",
    "lastname" : "Last Name",
    "primary-phone" : "Primary Phone",
    "secondary-phone" : "Secondary Phone"
}

const UserData: React.FC = () => {
    
    const [isAddAddress, setIsAddAddress] = useState(false);

    const [mongoDB, setMongoDB] = useState<Realm.Services.MongoDB>(null!);
    const [useDataCollection, setUseDataCollection] = useState<Realm.Services.MongoDB.MongoDBCollection<any>>(null!);
    const [personalDetails, setPersonalDetails] = useState<User[]>([]);

    const app: Realm.App = RealmApp();

    let navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    const addresses = useAppSelector(state => state.user.addresses);
    let currentUser = app.currentUser;

    useEffect(() => {
        const getDatabase = async () => {
			let database = await currentUser?.mongoClient("mongodb-atlas");
			//console.log("Userrrrr", user);
			setMongoDB(database!);
		};

        currentUser && getDatabase();  
        
        if(user){
            if(user.firstName){
                let personalDetails = [];
                let data = {} as {[key: string]: string};
                data.firstname = user.firstName as string;
                data.lastname = user.lastName as string;
                data["primary-phone"] = user.primaryPhone as string;
                data["secondary-phone"] = user.secondaryPhone as string;
                personalDetails.push(data as any);
                setPersonalDetails(personalDetails);
            }
        }
    }, [app]);


    useEffect(() => {
        if(mongoDB)
            setUseDataCollection(mongoDB.db("the-big-shop").collection("user-data"));
    }, [mongoDB]);

    useEffect(() => {
        
        if(app.currentUser && app.currentUser.providerType === "anon-user"){  
            navigate("/login");
        }
    }, [app]);


    const goToCart = () => {
        navigate("/cart");
    }

    const handleUserData = async (data: GeneralObject<any>) => {
        await dispatch(updateUserDetails(data));  
    }
    
    const handleAddressData = async (data: GeneralObject<any>) => {
        setIsAddAddress(false);
        await dispatch(updateAddress(data));
    }

    const handleAddAddress = () => {
        setIsAddAddress(true);
    }

    const handleCancelAddressData = () => {
        setIsAddAddress(false);
    }


    return <div className="user-address-container">
        <p style={{textAlign: "right", marginTop: "20px"}}><button className='button' onClick={goToCart}>Go To Cart</button></p>
        <FormEditor keysAndLabels={personalDetailsKeys} skipFields={{"_id": "_id"}} data={personalDetails} handleSubmit={handleUserData} showCancel={false} />
        {<FormEditor formVisible={false} keysAndLabels={addressKeys} skipFields={{"_id": "_id"}} data={addresses} handleSubmit={handleAddressData} deleteOption={true}/>}
        {isAddAddress && <FormEditor isAddAddress={isAddAddress} keysAndLabels={addressKeys} skipFields={{"_id": "_id"}} data={addresses} handleSubmit={handleAddressData} handleCancel={handleCancelAddressData}/>}
        {<button className='button' onClick={handleAddAddress}>Add Address</button>}
    </div>
}

export default UserData;

