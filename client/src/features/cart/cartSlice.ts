import { IDish } from '../../types/IDish.ts'
import { createSlice } from '@reduxjs/toolkit'

export interface CartState {
    items: IDish[]
}

const initialState: CartState = {
    items: [],
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: { payload: IDish }) => {
            state.items.push({
                ...action.payload,
                cartId: Date.now().toString(),
            })
        },
        updateCartItem: (state, action: { payload: IDish }) => {
            state.items = state.items.map((item) => {
                if (item.cartId === action.payload.cartId) {
                    return action.payload
                }
                return item
            })
        },
        updateCart: (state, action: { payload: IDish[] }) => {
            state.items = action.payload
        },
        removeFromCart: (state, action: { payload: string; type: string }) => {
            state.items = state.items.filter(
                (item) => item.cartId !== action.payload,
            )
        },
        clearCart: (state) => {
            state.items = []
        },
    },
})

export const {
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItem,
    updateCart,
} = cartSlice.actions

export const selectCartItems = (state: { cart: CartState }) => state.cart.items

export default cartSlice.reducer
