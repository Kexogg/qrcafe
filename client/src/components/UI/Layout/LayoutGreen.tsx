import {Outlet} from "react-router-dom";

export const LayoutGreen = () => {
    return (
        <div className={'bg-primary-700 text-primary-200 h-screen'}>
            <main className={'mx-auto max-w-lg container flex flex-col h-full py-10 px-5 text-center'}>
                <h1 className={'text-8xl pb-10'}>LOGO</h1>
                <Outlet/></main>
        </div>
    );
};