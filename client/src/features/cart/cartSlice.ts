import { createSlice } from '@reduxjs/toolkit'
import { FoodStatus, IOrderEntry } from '../../types/IOrderEntry.ts'

export interface CartState {
    items: IOrderEntry[]
    confirmed: boolean
}

const initialState: CartState = {
    items: [],
    confirmed: false,
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: { payload: IOrderEntry }) => {
            console.log(action.payload)
            state.items.push({
                ...action.payload,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                state: FoodStatus.NEW,
            })
        },
        updateCartItem: (state, action: { payload: IOrderEntry }) => {
            state.items = state.items.map((item) => {
                if (item.id === action.payload.id) {
                    return action.payload
                }
                return item
            })
        },
        removeFromCart: (state, action: { payload: string; type: string }) => {
            state.items = state.items.filter(
                (item) => item.id !== action.payload,
            )
        },
        updateItem: (state, action: { payload: IOrderEntry }) => {
            state.items = state.items.map((item) => {
                if (item.id === action.payload.id) {
                    return action.payload
                }
                return item
            })
        },
        clearCart: (state) => {
            state.items = []
        },
        setCart: (state, action: { payload: IOrderEntry[] }) => {
            state.items = action.payload
        },
        updateConfirmed: (state, action: { payload: boolean }) => {
            state.confirmed = action.payload
        },
    },
})

export const {
    addToCart,
    removeFromCart,
    clearCart,
    setCart,
    updateCartItem,
    updateConfirmed,
} = cartSlice.actions

export default cartSlice.reducer
