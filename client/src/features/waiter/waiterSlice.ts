import { createSlice } from '@reduxjs/toolkit'

export interface WaiterState {
    name: string
    id: string
    image: string | null
}

const initialState: WaiterState = {
    name: '',
    id: '0',
    image: null,
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
