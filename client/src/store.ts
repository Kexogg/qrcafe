import { configureStore } from '@reduxjs/toolkit'
import {cartSlice} from "./features/cart/cartSlice.ts";
import {waiterSlice} from "./features/waiter/waiterSlice.ts";

export const store = configureStore({
    reducer: {
        cart: cartSlice.reducer,
        waiter: waiterSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch