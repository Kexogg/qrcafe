import { Navigate, Route, Routes } from 'react-router-dom'
import { LayoutGreen } from '../components/UI/Layout/LayoutGreen.tsx'
import { Login } from '../pages/Login/Login.tsx'
import { EmployeeLogin } from '../pages/Login/EmployeeLogin.tsx'

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
                <Route path={'employee'} element={<EmployeeLogin />} />
            </Route>
            <Route path="*" element={<Navigate replace to={'/login'} />} />
        </Routes>
    )
}
