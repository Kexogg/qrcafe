import {Chip} from "../Chip/Chip.tsx";

type CatalogProps = {
    title: string;
}
export const Catalog = ({title}: CatalogProps) => {
    return (
        <>
            <h2 className={'text-accent-800 font-bold text-3xl ml-5 my-5 align-middle'}>{title}</h2>
            <nav>
                <ul className={'flex gap-3'}>
                    <Chip text={'Напитки'}/>
                    <Chip text={'Напитки'}/>
                    <Chip text={'Напитки'}/>
                </ul>
            </nav>
        </>

    );
};