import {Outlet} from "react-router-dom";

const Layout = () => {
    return (
        <div className={'bg-primary-100'}>
        <Outlet />
        </div>
    );
};

export default Layout;