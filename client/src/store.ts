import {
    UnknownAction,
    combineReducers,
    configureStore,
} from '@reduxjs/toolkit'
import { CartState, cartSlice } from './features/cart/cartSlice.ts'
import { WaiterState, waiterSlice } from './features/waiter/waiterSlice.ts'
import { SessionState, sessionSlice } from './features/session/sessionSlice.ts'
import {
    customerSlice,
    CustomerState,
} from './features/customer/customerSlice.ts'

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

const appReducer = combineReducers({
    cart: cartSlice.reducer,
    waiter: waiterSlice.reducer,
    session: sessionSlice.reducer,
    customer: customerSlice.reducer,
})

export const CLEAR_STATE = 'CLEAR_STATE'

const rootReducer = (
    state:
        | {
              cart: CartState
              waiter: WaiterState
              session: SessionState
              customer: CustomerState
          }
        | Partial<{
              cart: CartState | undefined
              waiter: WaiterState | undefined
              session: SessionState | undefined
              customer: CustomerState | undefined
          }>
        | undefined,
    action: UnknownAction,
) => {
    if (action.type === CLEAR_STATE) {
        localStorage.clear()
        return appReducer(undefined, action)
    }
    return appReducer(state, action)
}

export const store = configureStore({
    reducer: rootReducer,
    preloadedState,
})

store.subscribe(() => saveToLocalStorage(store.getState()))

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
