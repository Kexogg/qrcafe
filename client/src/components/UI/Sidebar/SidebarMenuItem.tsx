import { Link } from 'react-router-dom'
import { IMenuItem } from '../../../types/IMenuItem.ts'

type SidebarMenuItemProps = {
    item: IMenuItem
    minimized: boolean
}
export const SidebarMenuItem = ({ item, minimized }: SidebarMenuItemProps) => {
    return (
        <li key={item.path}>
            <Link
                to={item.path}
                className={
                    'flex h-12 items-center justify-start gap-3 px-5 py-3 hover:bg-primary-600'
                }>
                {item.icon}
                <span className={minimized ? 'hidden' : ''}>{item.name}</span>
            </Link>
        </li>
    )
}
