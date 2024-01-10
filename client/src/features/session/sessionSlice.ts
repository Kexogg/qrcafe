import { createSlice } from '@reduxjs/toolkit'

export interface SessionState {
    token: string | undefined
    restaurantId: string | undefined
    tokenTimestamp: number | undefined
    type: number | undefined // 0: employee, 1: customer
}

const initialState: SessionState = {
    token: undefined,
    restaurantId: undefined,
    tokenTimestamp: undefined,
    type: undefined,
}

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setToken: (state, action: { payload: string }) => {
            state.token = action.payload
            state.tokenTimestamp = Date.now()
        },
        setRestaurantId: (state, action: { payload: string }) => {
            state.restaurantId = action.payload
        },
        setSession: (state, action: { payload: SessionState }) => {
            Object.assign(state, action.payload)
        },
        resetSession: (state) => {
            Object.assign(state, initialState)
        },
    },
})

export const { setSession, setToken, resetSession, setRestaurantId } =
    sessionSlice.actions

export default sessionSlice.reducer
