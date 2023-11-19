import {Outlet} from "react-router-dom";
import {BuildInfo} from "../../BuildInfo/BuildInfo.tsx";

export const LayoutGreen = () => {
    return (
        <div className={'bg-primary-700 text-primary-200 h-[100dvh] max-h-screen overflow-fixed'}>
            <main className={'mx-auto max-w-lg container flex flex-col h-full pt-10 px-5 text-center'}>
                <h1 className={'text-8xl pb-10'}>LOGO</h1>
                <Outlet/>
                <pre className="text-xs my-2.5"><BuildInfo/></pre>
            </main>
        </div>
    );
};