import { Outlet } from 'react-router-dom'
import { Sidebar } from '../Sidebar/Sidebar.tsx'

export const LayoutDashboard = () => {
    return (
        <div className={'flex min-h-[100dvh] bg-primary-100'}>
            <Sidebar />
            <main className={'container mx-auto mt-5 grow px-3'}>
                <Outlet />
            </main>
        </div>
    )
}
