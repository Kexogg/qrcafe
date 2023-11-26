import {Outlet} from "react-router-dom";
import {CustomerNavigationMenu} from "../CustomerMenu/CustomerNavigationMenu.tsx";

const Layout = () => {
    return (
        <div className={'flex flex-col min-h-[100dvh] bg-primary-100'}>
            <main className={'grow container mx-auto mt-5'}>
                <Outlet/>
            </main>
            <CustomerNavigationMenu/>
        </div>
    );
};

export default Layout;