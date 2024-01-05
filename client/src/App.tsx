import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/roboto-flex'
import { useAppSelector } from './hooks.ts'
import { CustomerRouter } from './routers/CustomerRouter.tsx'
import { WaiterRouter } from './routers/WaiterRouter.tsx'
import { LoginRouter } from './routers/LoginRouter.tsx'
import { DashboardRouter } from './routers/DashboardRouter.tsx'

function App() {
    const token = useAppSelector((state) => state.session.token)
    const sessionType = useAppSelector((state) => state.session.type)
    return (
        <BrowserRouter>
            {(sessionType === undefined || token === undefined) && (
                <LoginRouter />
            )}
            {token && sessionType == 0 && <WaiterRouter />}
            {token && sessionType == 1 && <CustomerRouter />}
            {token && sessionType == 2 && <DashboardRouter />}
        </BrowserRouter>
    )
}

export default App
