import {createSlice} from "@reduxjs/toolkit";
import {Waiter} from "../../types/Waiter.ts";

export interface WaiterState {
    waiter: Waiter | null
}

const initialState: WaiterState = {
    waiter: null
}

export const waiterSlice = createSlice({
    name: 'waiter',
    initialState,
    reducers: {
        setWaiter: (state, action: {payload: Waiter}) => {
            state.waiter = action.payload
        },
        clearWaiter: (state) => {
            state.waiter = null
        }
    }
})

export const {setWaiter, clearWaiter} = waiterSlice.actions

export const selectWaiter = (state: { waiter: WaiterState }) => state.waiter.waiter

export default waiterSlice.reducer