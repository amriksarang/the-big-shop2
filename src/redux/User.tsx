import { SliceCaseReducers, createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import * as Realm from "realm-web";

import { handleAuthenticationError } from '../utils/utils';
import RealmApp from '../utils/mongodb';
import { GeneralObject } from '../interfaces/User';

interface UserReducers extends SliceCaseReducers<UserState>{}

interface UserState{
    isLoggedIn: boolean,
    errorMessage: string,
    isLoginError: boolean,
    email: string,
    addresses: [],
    firstName: string,
    lastName: string,
    userId: string,
    primaryPhone: string,
    secondaryPhone: string,
    registerationSuccess: boolean
}

export interface UserData{
    email: string,
    password: string
}

interface ThunkAPI{
    dispatch: any, 
    getState: any, 
    rejectWithValue: any
}

const userState: UserState = {
    isLoggedIn: false,
    errorMessage: '',
    isLoginError: false,
    email: '',
    addresses: [],
    firstName: '',
    lastName: '',
    userId: '',
    primaryPhone: '',
    secondaryPhone: '',
    registerationSuccess: false
}

interface UserDetails{
    isLoggedIn: boolean,
    email: string,
    addresses: [],
    firstName: string,
    lastName: string,
    userId: string,
    primaryPhone: string,
    secondaryPhone: string    
}

let app = RealmApp();

const initializeState = (state: UserDetails) => {
    state.isLoggedIn = false;
    state.email = '';
    state.addresses = [];
    state.firstName = '';
    state.lastName = '';
    state.primaryPhone = '';
    state.secondaryPhone = '';
    state.userId = '';
}

const retrieveData = (result: UserDetails, customData: any) => {
    result.isLoggedIn = true;
    result.email = customData.email;
    result.addresses = customData.addresses;
    result.firstName = customData["firstname"];
    result.lastName = customData["lastname"];
    result.primaryPhone = customData["primary-phone"];
    result.secondaryPhone = customData["secondary-phone"];
    result.userId = customData.userId;
}

const setState = (state: UserState, data: UserDetails) => {
    state.isLoggedIn = true;
    state.email = data.email;
    state.addresses = data.addresses;
    state.firstName = data.firstName;
    state.lastName = data.lastName;
    state.primaryPhone = data.primaryPhone;
    state.secondaryPhone = data.secondaryPhone;
    state.userId = data.userId;
}

export const refreshData = createAsyncThunk(
    'users/refreshData',
    async ( _, {rejectWithValue} : ThunkAPI ) => {
        try{
            await app?.currentUser?.refreshCustomData();
            const user = app.currentUser;
            let customData = user?.customData as any;
            let result: UserDetails = {} as UserDetails;

            retrieveData(result, customData);

            return result;
        }catch(error: any){
            return rejectWithValue(error);
        }
    }
);

export const updateUserDetails = createAsyncThunk('users/updateUserDetails', async (data: GeneralObject<any>, {dispatch} : ThunkAPI) => {
    const user = app.currentUser;
    const userDataCollection = user?.mongoClient("mongodb-atlas").db("the-big-shop").collection("user-data");
    await userDataCollection?.updateOne(
        { userId: user?.id }, 
        { $set: { 
            firstname: data[0]?.firstname!,
            lastname: data[0].lastname,
            "primary-phone": data[0]["primary-phone"],
            "secondary-phone": data[0]["secondary-phone"],
            email: user?.profile.email
            
        } } , {upsert: true}
    );
    dispatch(refreshData());
    return '';
});

export const updateAddress = createAsyncThunk('users/updateAddress', async (data: GeneralObject<any>) => {
    const user = app.currentUser;
    const userDataCollection = user?.mongoClient("mongodb-atlas").db("the-big-shop").collection("user-data");
    await userDataCollection?.updateOne(
        { userId: user?.id }, 
        { $set: { 
            addresses:data
        } } , {upsert: true}
    );
    await user?.refreshCustomData();
    let customData = user?.customData as any;
    let result: UserDetails = {} as UserDetails;

    retrieveData(result, customData);
    return result;
});

export const loginAnonymous = createAsyncThunk(
    'users/loginAnonymous', 
    async ( _, {rejectWithValue} : ThunkAPI ) => {
        try{
            const credentials = Realm.Credentials.anonymous();
            await app?.logIn(credentials);
            
            return '';
        }catch( error:any){
            return rejectWithValue(error);
        }
});

export const login = createAsyncThunk(
    'users/login', 
    async ( data : UserData, {rejectWithValue} : ThunkAPI ) => {
        try{
            const credentials = Realm.Credentials.emailPassword(data.email, data.password);
            
            const user = await app?.logIn(credentials);

            let customData = user?.customData as any;
            
            let result: UserDetails = {} as UserDetails;

            retrieveData(result, customData);

            return result;
        }catch( error:any){
            return rejectWithValue(error);
        }
});

export const registerUser = createAsyncThunk(
    'users/registerUser', 
    async ( data : UserData, {rejectWithValue} : ThunkAPI ) => {
        try{
            return app.emailPasswordAuth.registerUser({...data});

        }catch( error: any){
            
            return rejectWithValue(error);
        }
});

export const logout = createAsyncThunk(
    'users/logout', 
    async ( _, {rejectWithValue} : ThunkAPI ) => {
        try{
            await app?.currentUser?.logOut();
            return 'success';
        }catch( error:any){
            return rejectWithValue(error);
        }
});

const userAdaptor = createEntityAdapter();

const userSlice = createSlice<UserState, UserReducers, string>({
    name: 'users',
    initialState: userAdaptor.getInitialState(userState),
    reducers: {},
    extraReducers: {
        [login.fulfilled as any]: (state: UserState, action) => {
            let data = action.payload;
            setState(state, data);
        },
        [login.rejected as any]: (state: UserState, action) => {
            state.errorMessage = handleAuthenticationError(action.payload);
            state.isLoginError = true;
        },
        [logout.fulfilled as any]: (state: UserState) => {
            initializeState(state);
            
        },
        [logout.rejected as any]: (state: UserState, action) => {
            
        },
        [refreshData.fulfilled as any]: (state: UserState, action) => {
            let data = action.payload;
            setState(state, data);
        },
        [refreshData.rejected as any]: (state: UserState, action) => {
            state.errorMessage = handleAuthenticationError(action.payload);
            state.isLoginError = true;
        },
        [updateAddress.fulfilled as any]: (state: UserState, action) => {
            let data = action.payload;
            setState(state, data);
        },
        [registerUser.fulfilled as any]: (state: UserState, action) => {
            state.errorMessage = '';
            state.registerationSuccess = true;
        },
        [registerUser.rejected as any]: (state: UserState, action) => {
            if(action.error.message.indexOf('name already in use') > -1)
                state.errorMessage = 'Account with this email already exists';
        }
    }
});


export const userSelectors = userAdaptor.getSelectors();

export default userSlice.reducer;
