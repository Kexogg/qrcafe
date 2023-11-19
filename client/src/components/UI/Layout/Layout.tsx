import {Outlet} from "react-router-dom";
import {CustomerNavigationMenu} from "../CustomerMenu/CustomerNavigationMenu.tsx";

const Layout = () => {
    return (
        <div className={'bg-primary-50 flex flex-col h-[100dvh]'}>
            <main className={'grow container mx-auto mt-5'}>
                <Outlet/>
            </main>
            <CustomerNavigationMenu/>
        </div>
    );
};

export default Layout;