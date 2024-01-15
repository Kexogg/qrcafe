import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../components/UI/Layout/Layout.tsx'
import { WaiterHome } from '../pages/Waiter/WaiterHome/WaiterHome.tsx'
import { NewOrder } from '../pages/Waiter/NewOrder/NewOrder.tsx'
import { WaiterChat } from '../pages/Waiter/WaiterChat/WaiterChat.tsx'
import { WaiterProfile } from '../pages/Waiter/WaiterProfile/WaiterProfile.tsx'
import { WaiterCatalog } from '../pages/Waiter/WaiterCatalog/WaiterCatalog.tsx'
import { TablePage } from '../pages/Waiter/TablePage/TablePage.tsx'
import { WaiterChatCustomer } from '../pages/Waiter/WaiterChat/WaiterChatCustomer.tsx'

export const WaiterRouter = () => {
    return (
        <Routes>
            <Route path="/employee" element={<Layout customer={false} />}>
                <Route index path="home" element={<WaiterHome />} />
                <Route path="new-order/:id?" element={<NewOrder />} />
                <Route path="chat" element={<WaiterChat />} />
                <Route path="chat/:id" element={<WaiterChatCustomer />} />
                <Route path="account" element={<WaiterProfile />} />
                <Route path="catalog" element={<WaiterCatalog />} />
                <Route path="table/:id" element={<TablePage />} />
            </Route>
            <Route
                path="*"
                element={<Navigate replace to={'/employee/home'} />}
            />
        </Routes>
    )
}
