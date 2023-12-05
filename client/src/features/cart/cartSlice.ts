import {IDish} from "../../types/IDish.ts";
import {createSlice} from "@reduxjs/toolkit";

export interface CartState {
    items: IDish[]
}

const initialState: CartState = {
    items: []
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: {payload: IDish}) => {
            state.items.push({...action.payload, cartId: Date.now().toString()})
        },
        removeFromCart: (state, action: {payload: string, type: string}) => {
            state.items = state.items.filter(item => item.cartId !== action.payload)
        }
    }
})

export const {addToCart, removeFromCart} = cartSlice.actions

export const selectCartItems = (state: { cart: CartState }) => state.cart.items

export default cartSlice.reducer