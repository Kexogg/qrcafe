import { Outlet } from 'react-router-dom'
import { NavigationMenu } from '../NavigationMenu/NavigationMenu.tsx'

type LayoutProps = {
    customer: boolean
}
const Layout = ({ customer }: LayoutProps) => {
    return (
        <div className={'flex min-h-[100dvh] flex-col bg-primary-100'}>
            <main className={'container mx-auto mt-5 grow'}>
                <Outlet />
            </main>
            <NavigationMenu customer={customer} />
        </div>
    )
}

export default Layout
