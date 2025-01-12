import { createSlice, createEntityAdapter, createAsyncThunk, SliceCaseReducers} from '@reduxjs/toolkit';
import { ProductCart, Products, ProductVarient, CartItem } from '../interfaces/Products';
import { filteredProducts, calculateTotal, removeProducts } from './Helper';
import RealmApp from '../utils/mongodb';
import { Address } from '../interfaces/User';
import { convertStringToInt, isPropertyNullOrUndefinedOrEmpty } from '../utils/utils';

interface CartReducers extends SliceCaseReducers<OrderData>{}

export const cartState: OrderData = {
    products: null!,
    userId: null!,
    address: null!,
    "credit-card": '',
    "primary-phone": '',
    "secondary-phone": '',
    "expiry-date": '',
    "name-on-card": '',
    success: false
};

export interface CartData {
    product: Products,
    quantity: number,
    varient: ProductVarient[]
}


interface CartAction{
    type?: string,
    payload?: any
}

interface ThunkAPI{
    dispatch: any, 
    getState: any, 
    rejectWithValue: any
}

export interface OrderData{
    userId: string,
    address: Address,
    "credit-card": string,
    "primary-phone": string,
    "secondary-phone": string,
    "expiry-date": string,
    "name-on-card": string,
    products: ProductCart,
    success?: boolean
}

// interface CartReducers<OrderData, CartAction extends Action<any>> {
//     [prop: string]: CartAction extends undefined ? 
//                     (state: OrderData) => void :
//                     CaseReducer<OrderData, PayloadAction>
// };

// interface CartReducers<OrderData> {
//     [K: string]:  (state: OrderData) => void | CaseReducer<OrderData, PayloadAction<any>> | CaseReducerWithPrepare<OrderData, PayloadAction<any, string, any, any>>;
// };

// export declare type CaseReducer<S = any, A extends Action = AnyAction> = (state: Draft<S>, action: A) => NoInfer<S> | void | Draft<NoInfer<S>>;

export const createOrder = createAsyncThunk(
    'cart/createOrder', 
    async ( data : OrderData, {dispatch, getState, rejectWithValue} : ThunkAPI ) => {
        try{

            let mongoDB = RealmApp().currentUser!.mongoClient("mongodb-atlas");
            let database = mongoDB.db("the-big-shop");
            let orderCollection = database.collection("orders");

            await orderCollection.insertOne(data);

            return data;
        }catch( error:any){
            return rejectWithValue(error);
        }
});

const cartAdaptor = createEntityAdapter();

const cartSlice = createSlice<OrderData, CartReducers, string>({
    name: 'cart',
    initialState: cartAdaptor.getInitialState(cartState),
    reducers: {
        setItem(state: OrderData, action: CartAction){ // action.payload = {product, quantity, varient}
            console.log('action', action);
            
            let varientCost = action.payload.varient.reduce((prev: number, item: ProductVarient) => {
                if (isPropertyNullOrUndefinedOrEmpty(item, "price")) {
                    return prev;
                }
                return convertStringToInt(item.price || 0) + prev;
            }, 0);

            let mrp: number = convertStringToInt(action.payload.product.mrp);

            let productPrice: number = (mrp + varientCost) * action.payload.quantity;

            if(!state.products){
                state.products = {
                    products: [{ 
                        product: action.payload.product, 
                        quantity: action.payload.quantity, 
                        varient: action.payload.varient, 
                        productPrice
                     }] as CartItem[],
                    total: productPrice,
                }
            }else{
                const filteredProductList = filteredProducts(state.products?.products, action.payload);
                state.products = {
                    products: [
                        ...filteredProductList,
                        {
                            product: action.payload.product, 
                            quantity: action.payload.quantity, 
                            varient: action.payload.varient, 
                            productPrice
                         },
                    ],
                    total: calculateTotal(filteredProductList) + productPrice,
                };
            }
            console.log(JSON.stringify(state));
        },
        removeItem(state: OrderData, action: CartAction) { // action.payload = item: CartItem, varient: Array<ProductVarient>
                const filteredProductList = removeProducts(state.products.products, action.payload);
                state.products.products = filteredProductList;
                state.products.total = calculateTotal(filteredProductList)
        },
        emptyCart(state: OrderData){
            return state = {...cartState, success: cartState.success}
        }
    },
    extraReducers: {
        [createOrder.fulfilled as any]: (state: OrderData, action) => {
            state.success = true;
        }
    }
})

export const { setItem, removeItem, emptyCart } = cartSlice.actions
export default cartSlice.reducer;


// type AtLeastOne<T extends Record<string, any>> = keyof T extends infer K
//   ? K extends string
//     ? Pick<T, K & keyof T> & Partial<T>
//     : never
//   : never

// // Use this type instead of `Partial<MyPayloadType>`
// type AtLeastOneUserField = AtLeastOne<CartAction>;
