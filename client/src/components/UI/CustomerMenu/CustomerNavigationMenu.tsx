import {AccountCircle, Chat, Home, Notifications, ShoppingCart} from "@mui/icons-material";
import {Link, useLocation} from "react-router-dom";

interface MenuItem {
    path: string;
    icon: React.ReactNode;
}

export const CustomerNavigationMenu = () => {
    const location = useLocation();
    const menuItems: MenuItem[] = [
        {path: '/customer/chat', icon: <Chat fontSize={'large'}/>},
        {path: '/customer/notifications', icon: <Notifications fontSize={'large'}/>},
        {path: '/customer/home', icon: <Home fontSize={'large'}/>},
        {path: '/customer/cart', icon: <ShoppingCart fontSize={'large'}/>},
        {path: '/customer/account', icon: <AccountCircle fontSize={'large'}/>},
    ];

    return (
        <nav>
            <ul className={'flex justify-around bg-primary-700'}>
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <Link className={`block p-3 ${location.pathname.includes(item.path) ? 'text-primary-50' : 'text-primary-300'}`} to={item.path}>
                            {item.icon}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};