import { DishStatus, IDish } from '../../types/IDish.ts'
import { createSlice } from '@reduxjs/toolkit'

export interface CartState {
    items: IDish[]
    confirmed: boolean
    paid: boolean
}

const initialState: CartState = {
    items: [],
    confirmed: false,
    paid: false,
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: { payload: IDish }) => {
            state.items.push({
                ...action.payload,
                cartId: Date.now().toString(),
                status: DishStatus.NEW,
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
        updateConfirmed: (state, action: { payload: boolean }) => {
            state.confirmed = action.payload
        },
        updatePaid: (state, action: { payload: boolean }) => {
            state.paid = action.payload
        },
    },
})

export const {
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItem,
    updateCart,
    updateConfirmed,
    updatePaid,
} = cartSlice.actions

export const selectCartItems = (state: { cart: CartState }) => state.cart.items

export const selectOrdered = (state: { cart: CartState }) =>
    state.cart.confirmed
export const selectPaid = (state: { cart: CartState }) => state.cart.paid

export default cartSlice.reducer
