import {
    AccountCircleRounded,
    ChatRounded,
    HomeRounded,
    NotificationsRounded,
    ShoppingCartRounded
} from "@mui/icons-material";
import {Link, useLocation} from "react-router-dom";

interface MenuItem {
    path: string;
    icon: React.ReactNode;
}

export const CustomerNavigationMenu = () => {
    const location = useLocation();
    const menuItems: MenuItem[] = [
        {path: '/customer/chat', icon: <ChatRounded fontSize={'large'}/>},
        {path: '/customer/notifications', icon: <NotificationsRounded fontSize={'large'}/>},
        {path: '/customer/home', icon: <HomeRounded fontSize={'large'}/>},
        {path: '/customer/cart', icon: <ShoppingCartRounded fontSize={'large'}/>},
        {path: '/customer/account', icon: <AccountCircleRounded fontSize={'large'}/>},
    ];

    return (
        <nav className={'sticky bottom-0 z-20'}>
            <ul className={'flex justify-around bg-primary-700'}>
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <Link className={`block p-3 active:bg-white/10 ${location.pathname.includes(item.path) ? 'text-primary-50' : 'text-primary-300'}`} to={item.path}>
                            {item.icon}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};