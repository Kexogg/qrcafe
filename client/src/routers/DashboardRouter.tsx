import { Navigate, Route, Routes } from 'react-router-dom'

import { DashboardHome } from '../pages/Dashboard/DashboardHome/DashboardHome.tsx'
import { LayoutDashboard } from '../components/UI/Layout/LayoutDashboard.tsx'
import { DashboardTables } from '../pages/Dashboard/DashboardTables/DashboardTables.tsx'
import { DashboardSettings } from '../pages/Dashboard/DashboardSettings/DashboardSettings.tsx'
import { DashboardOrders } from '../pages/Dashboard/DashboardOrders/DashboardOrders.tsx'
import { DashboardEmployees } from '../pages/Dashboard/DashboardEmployees/DashboardEmployees.tsx'
import { DashboardCatalog } from '../pages/Dashboard/DashboardCatalog/DashboardCatalog.tsx'
import { DashboardFood } from '../pages/Dashboard/DashboardFood/DashboardFood.tsx'
import { DashboardFoodEditor } from '../pages/Dashboard/DashboardFood/DashboardFoodEditor.tsx'
import { DashboardEmployeeEditor } from '../pages/Dashboard/DashboardEmployees/DashboardEmployeeEditor.tsx'
import { DashboardCatalogEditor } from '../pages/Dashboard/DashboardCatalog/DashboardCatalogEditor.tsx'

export const DashboardRouter = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<LayoutDashboard />}>
                <Route index path="home" element={<DashboardHome />} />
                <Route path="tables" element={<DashboardTables />} />
                <Route path="settings" element={<DashboardSettings />} />
                <Route path="orders" element={<DashboardOrders />} />
                <Route path="employees" element={<DashboardEmployees />} />
                <Route
                    path="employees/edit/:id?"
                    element={<DashboardEmployeeEditor />}
                />
                <Route path="catalog" element={<DashboardCatalog />} />
                <Route
                    path="catalog/edit/:id?"
                    element={<DashboardCatalogEditor />}
                />
                <Route path="food" element={<DashboardFood />} />
                <Route
                    path="food/edit/:id?"
                    element={<DashboardFoodEditor />}
                />
            </Route>
            <Route
                path="*"
                element={<Navigate replace to={'/dashboard/home'} />}
            />
        </Routes>
    )
}
