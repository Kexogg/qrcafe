import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../components/UI/Layout/Layout.tsx'
import { CustomerHome } from '../pages/Customer/CutomerHome/CustomerHome.tsx'
import { CustomerChat } from '../pages/Customer/CustomerChat/CustomerChat.tsx'
import { CustomerCart } from '../pages/Customer/CustomerCart/CustomerCart.tsx'
import { CustomerPayment } from '../pages/Customer/CustomerPayment/CustomerPayment.tsx'
import { CustomerSettings } from '../pages/Customer/CustomerSettings/CustomerSettings.tsx'
import { LayoutGreen } from '../components/UI/Layout/LayoutGreen.tsx'
import { CustomerThankYou } from '../pages/Customer/CustomerThankYou/CustomerThankYou.tsx'

export const CustomerRouter = () => {
    return (
        <Routes>
            <Route path="/customer" element={<Layout customer={true} />}>
                <Route index path="home" element={<CustomerHome />} />
                <Route path="chat" element={<CustomerChat />} />
                <Route path="cart" element={<CustomerCart />} />
                <Route path="payment" element={<CustomerPayment />} />
                <Route path="settings" element={<CustomerSettings />} />
                <Route path="*" element={<h1>404</h1>} />
            </Route>
            <Route path="/customer" element={<LayoutGreen />}>
                <Route path="thankyou" element={<CustomerThankYou />} />
            </Route>
            <Route
                path="*"
                element={<Navigate replace to={'/customer/home'} />}
            />
        </Routes>
    )
}
