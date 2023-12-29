import { createSlice } from '@reduxjs/toolkit'

export interface SessionState {
    token: string | null
    tokenTimestamp: Date | null
    type: number // 0: employee, 1: customer
}

const initialState: SessionState = {
    token: null,
    tokenTimestamp: null,
    type: 0,
}

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setToken: (state, action: { payload: string }) => {
            state.token = action.payload
            state.tokenTimestamp = new Date()
        },
        clearToken: (state) => {
            Object.assign(state, initialState)
        },
    },
})

export const { setToken, clearToken } = sessionSlice.actions

export const selectWaiter = (state: SessionState) => state

export default sessionSlice.reducer
