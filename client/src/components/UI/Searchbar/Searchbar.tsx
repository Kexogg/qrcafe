import {SearchRounded} from "@mui/icons-material";

export const Searchbar = () => {
    return (
        <search className={'my-5'}>
            <form className={'flex items-center justify-between w-auto   px-3 h-8 max-w-md border-b-2 border-primary-700 mx-5 text-primary-700'}>
                <input type={'text'} placeholder={'Поиск'} className={'w-full h-full bg-transparent outline-none placeholder-primary-500'}/>
                <SearchRounded/>
            </form>
        </search>
    );
};