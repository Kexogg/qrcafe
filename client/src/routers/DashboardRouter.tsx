import { Navigate, Route, Routes } from 'react-router-dom'

import { DashboardHome } from '../pages/Dashboard/DashboardHome/DashboardHome.tsx'
import { LayoutDashboard } from '../components/UI/Layout/LayoutDashboard.tsx'
import { DashboardTables } from '../pages/Dashboard/DashboardTables/DashboardTables.tsx'
import { DashboardSettings } from '../pages/Dashboard/DashboardSettings/DashboardSettings.tsx'
import { DashboardOrders } from '../pages/Dashboard/DashboardOrders/DashboardOrders.tsx'
import { DashboardEmployees } from '../pages/Dashboard/DashboardEmployees/DashboardEmployees.tsx'
import { DashboardCatalog } from '../pages/Dashboard/DashboardCatalog/DashboardCatalog.tsx'

export const DashboardRouter = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<LayoutDashboard />}>
                <Route index path="home" element={<DashboardHome />} />
                <Route path="tables" element={<DashboardTables />} />
                <Route path="settings" element={<DashboardSettings />} />
                <Route path="orders" element={<DashboardOrders />} />
                <Route path="employees" element={<DashboardEmployees />} />
                <Route path="catalog" element={<DashboardCatalog />} />
            </Route>
            <Route
                path="*"
                element={<Navigate replace to={'/dashboard/home'} />}
            />
        </Routes>
    )
}
