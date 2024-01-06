import { Navigate, Route, Routes } from 'react-router-dom'

import { DashboardHome } from '../pages/Dashboard/DashboardHome/DashboardHome.tsx'
import { LayoutDashboard } from '../components/UI/Layout/LayoutDashboard.tsx'

export const DashboardRouter = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<LayoutDashboard />}>
                <Route index path="home" element={<DashboardHome />} />
            </Route>
            <Route
                path="*"
                element={<Navigate replace to={'/dashboard/home'} />}
            />
        </Routes>
    )
}
