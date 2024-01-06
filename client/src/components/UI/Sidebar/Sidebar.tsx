import { IMenuItem } from '../../../types/IMenuItem.ts'
import {
    FirstPage,
    HomeRounded,
    LastPage,
    MenuBookRounded,
    PeopleRounded,
    SettingsRounded,
    ShoppingCartRounded,
    TableRestaurantRounded,
} from '@mui/icons-material'
import { useState } from 'react'
import icon from '/icons/icon.svg?url'
import { SidebarMenuItem } from './SidebarMenuItem.tsx'
export const Sidebar = () => {
    const iconSize = 'medium'
    const [minimized, setMinimized] = useState(false)
    const items: IMenuItem[] = [
        {
            path: '/dashboard/home',
            icon: <HomeRounded fontSize={iconSize} />,
            name: 'Главная',
        },
        {
            path: '/dashboard/tables',
            icon: <TableRestaurantRounded fontSize={iconSize} />,
            name: 'Столики',
        },
        {
            path: '/dashboard/menu',
            icon: <MenuBookRounded fontSize={iconSize} />,
            name: 'Меню',
        },
        {
            path: '/dashboard/staff',
            icon: <PeopleRounded fontSize={iconSize} />,
            name: 'Сотрудники',
        },
        {
            path: '/dashboard/orders',
            icon: <ShoppingCartRounded fontSize={iconSize} />,
            name: 'Заказы',
        },
        {
            path: '/dashboard/settings',
            icon: <SettingsRounded fontSize={iconSize} />,
            name: 'Настройки',
        },
    ]
    return (
        <aside
            className={`flex h-auto shrink-0 grow flex-col bg-primary-700 py-5 text-primary-50 ${
                minimized ? 'w-16' : 'w-64'
            }`}>
            <h2 className={`ml-5 h-10 text-4xl ${minimized && 'hidden'}`}>
                QR Cafe
            </h2>
            <img
                src={icon}
                alt="icon"
                className={`mx-auto h-10 w-10 ${!minimized && 'hidden'}`}
            />
            <nav className={'mt-5 flex grow flex-col'}>
                <ul className={'text-lg'}>
                    {items.map((item) => (
                        <SidebarMenuItem
                            key={item.path}
                            item={item}
                            minimized={minimized}
                        />
                    ))}
                </ul>
            </nav>
            <button
                className={`${!minimized && 'ml-auto mr-3'} mt-auto`}
                aria-label={minimized ? 'Развернуть' : 'Свернуть'}
                onClick={() => setMinimized((s) => !s)}>
                {minimized ? (
                    <LastPage fontSize={'large'} />
                ) : (
                    <FirstPage fontSize={'large'} />
                )}
            </button>
        </aside>
    )
}
