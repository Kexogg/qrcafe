import { createSlice } from '@reduxjs/toolkit'

export interface CustomerState {
    name: string | undefined
}

const initialState: CustomerState = {
    name: undefined,
}

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        setCustomer: (state, action: { payload: CustomerState }) => {
            Object.assign(state, action.payload)
        },
        clearCustomer: (state) => {
            Object.assign(state, initialState)
        },
    },
})

export const { setCustomer } = customerSlice.actions

export default customerSlice.reducer
