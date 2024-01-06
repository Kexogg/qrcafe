import { Navigate, Route, Routes } from 'react-router-dom'

import { DashboardHome } from '../pages/Dashboard/DashboardHome/DashboardHome.tsx'
import { LayoutDashboard } from '../components/UI/Layout/LayoutDashboard.tsx'
import { DashboardTables } from '../pages/Dashboard/DashboardTables/DashboardTables.tsx'

export const DashboardRouter = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<LayoutDashboard />}>
                <Route index path="home" element={<DashboardHome />} />
                <Route path="tables" element={<DashboardTables />} />
            </Route>
            <Route
                path="*"
                element={<Navigate replace to={'/dashboard/home'} />}
            />
        </Routes>
    )
}
