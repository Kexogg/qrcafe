import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/roboto-flex'
import { useAppSelector } from './hooks/hooks.ts'
import { CustomerRouter } from './routers/CustomerRouter.tsx'
import { WaiterRouter } from './routers/WaiterRouter.tsx'
import { LoginRouter } from './routers/LoginRouter.tsx'
import { DashboardRouter } from './routers/DashboardRouter.tsx'
import { SessionType } from './features/session/sessionSlice.ts'

function App() {
    const token = useAppSelector((state) => state.session.token)
    const sessionType = useAppSelector((state) => state.session.type)
    return (
        <BrowserRouter>
            {(sessionType === undefined || token === undefined) && (
                <LoginRouter />
            )}
            {token && sessionType == SessionType.WAITER && <WaiterRouter />}
            {token && sessionType == SessionType.CUSTOMER && <CustomerRouter />}
            {token && sessionType == SessionType.ADMIN && <DashboardRouter />}
        </BrowserRouter>
    )
}

export default App
