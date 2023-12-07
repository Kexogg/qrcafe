import {
    ChatRounded,
    HomeRounded,
    ShoppingCartRounded,
} from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'
import { OverridableStringUnion } from '@mui/types'
import { SvgIconPropsSizeOverrides } from '@mui/material/SvgIcon/SvgIcon'
import { useAppSelector } from '../../../hooks.ts'
import { getFilteredCart } from '../../../helpers.ts'
import { DishStatus } from '../../../types/IDish.ts'

interface MenuItem {
    path: string
    icon: React.ReactNode
}

export const CustomerNavigationMenu = () => {
    const cart = useAppSelector((state) => state.cart.items)
    const location = useLocation()
    const iconSize: OverridableStringUnion<
        'inherit' | 'large' | 'medium' | 'small',
        SvgIconPropsSizeOverrides
    > = 'medium'
    const menuItems: MenuItem[] = [
        { path: '/customer/chat', icon: <ChatRounded fontSize={iconSize} /> },
        //{path: '/customer/notifications', icon: <NotificationsRounded fontSize={iconSize}/>},
        { path: '/customer/home', icon: <HomeRounded fontSize={iconSize} /> },
        {
            path: '/customer/cart',
            icon: <ShoppingCartRounded fontSize={iconSize} />,
        },
        //{path: '/customer/account', icon: <AccountCircleRounded fontSize={iconSize}/>},
    ]

    return (
        <nav className={'sticky bottom-0 z-20 h-12 overflow-hidden'}>
            <ul className={'flex justify-around bg-primary-700'}>
                {menuItems.map((item) => (
                    <li key={item.path} className={'relative'}>
                        <Link
                            className={`block p-3 active:bg-white/10 ${
                                location.pathname.includes(item.path)
                                    ? 'text-primary-50'
                                    : 'text-primary-300'
                            }`}
                            to={item.path}>
                            {item.icon}
                        </Link>
                        {item.path === '/customer/cart' &&
                            getFilteredCart(cart, DishStatus.NEW).length >
                                0 && (
                                <span
                                    className={
                                        'absolute left-1/2 top-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-700 text-sm font-medium text-white'
                                    }>
                                    {
                                        getFilteredCart(cart, DishStatus.NEW)
                                            .length
                                    }
                                </span>
                            )}
                    </li>
                ))}
            </ul>
        </nav>
    )
}
