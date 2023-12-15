import {
    AccountCircleRounded,
    AddRounded,
    BookRounded,
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

interface IMenuItem {
    path: string
    icon: React.ReactNode
    isCustomerRoute?: boolean
}

type NavigationMenuProps = {
    customer: boolean
}

export const NavigationMenu = ({ customer }: NavigationMenuProps) => {
    const cart = useAppSelector((state) => state.cart.items)
    const location = useLocation()
    const iconSize: OverridableStringUnion<
        'inherit' | 'large' | 'medium' | 'small',
        SvgIconPropsSizeOverrides
    > = 'medium'
    const menuItems: IMenuItem[] = [
        {
            path: '/customer/chat',
            icon: <ChatRounded fontSize={iconSize} />,
            isCustomerRoute: true,
        },
        {
            path: '/customer/home',
            icon: <HomeRounded fontSize={iconSize} />,
            isCustomerRoute: true,
        },
        {
            path: '/customer/cart',
            icon: <ShoppingCartRounded fontSize={iconSize} />,
            isCustomerRoute: true,
        },
        //Waiter
        {
            path: '/employee/home',
            icon: <HomeRounded fontSize={iconSize} />,
            isCustomerRoute: false,
        },
        {
            path: '/employee/chat',
            icon: <ChatRounded fontSize={iconSize} />,
            isCustomerRoute: false,
        },
        {
            path: '/employee/new-order',
            icon: <AddRounded fontSize={iconSize} />,
            isCustomerRoute: false,
        },
        {
            path: '/employee/catalog',
            icon: <BookRounded fontSize={iconSize} />,
            isCustomerRoute: false,
        },
        {
            path: '/employee/account',
            icon: <AccountCircleRounded fontSize={iconSize} />,
            isCustomerRoute: false,
        },
    ]

    return (
        <nav className={'sticky bottom-0 z-20 h-12 overflow-hidden'}>
            <ul className={'flex justify-around bg-primary-700'}>
                {menuItems
                    .filter((item) => item.isCustomerRoute === customer)
                    .map((item) => (
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
                                            getFilteredCart(
                                                cart,
                                                DishStatus.NEW,
                                            ).length
                                        }
                                    </span>
                                )}
                        </li>
                    ))}
            </ul>
        </nav>
    )
}
