import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './pages/Login/Login.tsx'
import { LayoutGreen } from './components/UI/Layout/LayoutGreen.tsx'
import Layout from './components/UI/Layout/Layout.tsx'
import { CustomerHome } from './pages/Customer/CutomerHome/CustomerHome.tsx'
import { CustomerChat } from './pages/Customer/CustomerChat/CustomerChat.tsx'
import { CustomerCart } from './pages/Customer/CustomerCart/CustomerCart.tsx'
import '@fontsource-variable/roboto-flex'
import { CustomerPayment } from './pages/Customer/CustomerPayment/CustomerPayment.tsx'
import { CustomerSettings } from './pages/Customer/CustomerSettings/CustomerSettings.tsx'
import { CustomerThankYou } from './pages/Customer/CustomerThankYou/CustomerThankYou.tsx'
import { WaiterHome } from './pages/Waiter/WaiterHome/WaiterHome.tsx'
import { TablePage } from './pages/Waiter/TablePage/TablePage.tsx'
import { WaiterChat } from './pages/Waiter/WaiterChat/WaiterChat.tsx'
import { WaiterProfile } from './pages/Waiter/WaiterProfile/WaiterProfile.tsx'
import { NewOrder } from './pages/Waiter/NewOrder/NewOrder.tsx'
import { WaiterCatalog } from './pages/Waiter/WaiterCatalog/WaiterCatalog.tsx'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LayoutGreen />}>
                    <Route index path="/" element={<Login />} />
                    <Route path="thankyou" element={<CustomerThankYou />} />
                </Route>
                <Route path="/customer" element={<Layout customer={true} />}>
                    <Route index path="home" element={<CustomerHome />} />
                    <Route path="chat" element={<CustomerChat />} />
                    <Route path="cart" element={<CustomerCart />} />
                    <Route path="payment" element={<CustomerPayment />} />
                    <Route path="settings" element={<CustomerSettings />} />
                    <Route path="*" element={<h1>404</h1>} />
                </Route>
                <Route path="/employee" element={<Layout customer={false} />}>
                    <Route index path="home" element={<WaiterHome />} />
                    <Route path="new-order" element={<NewOrder />} />
                    <Route path="chat" element={<WaiterChat />} />
                    <Route path="account" element={<WaiterProfile />} />
                    <Route path="catalog" element={<WaiterCatalog />} />
                    <Route path="table/:id" element={<TablePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
