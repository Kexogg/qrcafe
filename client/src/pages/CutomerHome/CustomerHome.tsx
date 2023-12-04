import {ServedBy} from "../../components/UI/ServedBy/ServedBy.tsx";
import {Showcase} from "../../components/UI/Showcase/Showcase.tsx";
import {getPlaceholderDish} from "../../types/IDish.ts";
import {Catalog} from "../../components/UI/Catalog/Catalog.tsx";

export const CustomerHome = () => {
    const dishes = [
        getPlaceholderDish(),
        getPlaceholderDish(),
        getPlaceholderDish()
    ]
    return (
        <>
            <ServedBy/>
            <Showcase title={'Новинки недели'} items={dishes}/>
            <Showcase title={'Мы рекомендуем'} items={dishes}/>
            <Catalog title={'Основное меню'}/>
        </>

    );
};