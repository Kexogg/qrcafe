import { Navigate, Route, Routes } from 'react-router-dom'
import { LayoutGreen } from '../components/UI/Layout/LayoutGreen.tsx'
import { Login } from '../pages/Login/Login.tsx'
import { LoginEmployee } from '../pages/Login/LoginEmployee/LoginEmployee.tsx'
import { LoginQrScanner } from '../pages/Login/LoginCodeEntry/LoginQrScanner.tsx'
import { LoginCodeEntry } from '../pages/Login/LoginCodeEntry/LoginCodeEntry.tsx'
import { LoginWelcome } from '../pages/Login/LoginWelcome/LoginWelcome.tsx'

export const LoginRouter = () => {
    return (
        <Routes>
            <Route
                index
                path="/"
                element={<Navigate replace to={'/login'} />}
            />
            <Route path={'login'} element={<LayoutGreen />}>
                <Route index element={<Login />}></Route>
                <Route path={'qr'} element={<LoginQrScanner />} />
                <Route path={'code'} element={<LoginCodeEntry />} />
                <Route path={'employee'} element={<LoginEmployee />} />
                <Route path={'welcome'} element={<LoginWelcome />} />
            </Route>
            <Route path="*" element={<Navigate replace to={'/login'} />} />
        </Routes>
    )
}
