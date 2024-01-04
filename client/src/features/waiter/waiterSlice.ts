import { createSlice } from '@reduxjs/toolkit'

export interface WaiterState {
    id: null | string
    name: string | undefined
    image: string | undefined
}

const initialState: WaiterState = {
    id: null,
    name: undefined,
    image: undefined,
}

export const waiterSlice = createSlice({
    name: 'waiter',
    initialState,
    reducers: {
        setWaiter: (state, action: { payload: WaiterState }) => {
            Object.assign(state, action.payload)
        },
        clearWaiter: (state) => {
            Object.assign(state, initialState)
        },
    },
})

export const { setWaiter, clearWaiter } = waiterSlice.actions

export const selectWaiter = (state: WaiterState) => state

export default waiterSlice.reducer
