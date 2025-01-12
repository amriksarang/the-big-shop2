
import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './User';
import CartReducer from './Cart';

const store = configureStore({
    reducer: {
        user: UserReducer,
        cart: CartReducer
    }
})
export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>

