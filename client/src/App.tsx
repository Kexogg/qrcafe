import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './pages/Login/Login.tsx'
import { LayoutGreen } from './components/UI/Layout/LayoutGreen.tsx'
import Layout from './components/UI/Layout/Layout.tsx'
import { CustomerHome } from './pages/CutomerHome/CustomerHome.tsx'
import { CustomerChat } from './pages/CustomerChat/CustomerChat.tsx'
import { CustomerAccount } from './pages/CustomerAccount/CustomerAccount.tsx'
import { CustomerNotifications } from './pages/CustomerNotifications/CustomerNotifications.tsx'
import { CustomerCart } from './pages/CustomerCart/CustomerCart.tsx'
import '@fontsource-variable/roboto-flex'
import { CustomerPayment } from './pages/CustomerPayment/CustomerPayment.tsx'
import { CustomerSettings } from './pages/CustomerSettings/CustomerSettings.tsx'
import { CustomerThankYou } from './pages/CustomerThankYou/CustomerThankYou.tsx'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LayoutGreen />}>
                    <Route index path="/" element={<Login />} />
                    <Route path="thankyou" element={<CustomerThankYou />} />
                </Route>
                <Route path="/customer" element={<Layout />}>
                    <Route index path="home" element={<CustomerHome />} />
                    <Route path="chat" element={<CustomerChat />} />
                    <Route path="cart" element={<CustomerCart />} />
                    <Route path="account" element={<CustomerAccount />} />
                    <Route
                        path="notifications"
                        element={<CustomerNotifications />}
                    />
                    <Route path="payment" element={<CustomerPayment />} />
                    <Route path="settings" element={<CustomerSettings />} />
                    <Route path="*" element={<h1>404</h1>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
