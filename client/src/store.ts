import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { cartSlice } from './features/cart/cartSlice.ts'
import { waiterSlice } from './features/waiter/waiterSlice.ts'

function saveToLocalStorage(state: RootState) {
    try {
        const serializedState = JSON.stringify(state)
        localStorage.setItem('state', serializedState)
    } catch (e) {
        console.warn(e)
    }
}

function loadFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem('state')
        if (serializedState === null) return undefined
        return JSON.parse(serializedState)
    } catch (e) {
        console.warn(e)
        return undefined
    }
}

const preloadedState = loadFromLocalStorage()

const reducers = combineReducers({
    cart: cartSlice.reducer,
    waiter: waiterSlice.reducer,
})

export const store = configureStore({
    reducer: reducers,
    preloadedState,
})

store.subscribe(() => saveToLocalStorage(store.getState()))

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
