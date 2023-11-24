import {ServedBy} from "../../components/UI/ServedBy/ServedBy.tsx";
import {Showcase} from "../../components/UI/Showcase/Showcase.tsx";
import {Dish} from "../../types/Dish.ts";
import food_placeholder from "../../../public/food_placeholder.jpg";
import {Catalog} from "../../components/UI/Catalog/Catalog.tsx";

export const CustomerHome = () => {
    const dishes = [
        new Dish(1, 'Dish 1', 123, 'Description', '100 kg', [], food_placeholder),
        new Dish(2, 'Dish 2', 123, 'Description', '100 kg', [], food_placeholder),
        new Dish(3, 'Dish 3', 123, 'Description', '100 kg', [], food_placeholder),
    ]
    return (
        <><ServedBy/>
            <Showcase title={'Новинки недели'} items={dishes}/>
            <Showcase title={'Мы рекомендуем'} items={dishes}/>
            <Catalog title={'Основное меню'}/>
        </>

    );
};