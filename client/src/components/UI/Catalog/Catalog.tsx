import {Chip} from "../Chip/Chip.tsx";
import food_placeholder from "/public/food_placeholder.jpg";
import {Dish} from "../../../types/Dish.ts";
import DishCard from "../DishCard/DishCard.tsx";

type CatalogProps = {
    title: string;
}
export const Catalog = ({title}: CatalogProps) => {
    const categories = [
        'Напитки',
        'Салаты',
        'Десерты',
        'Закуски',
        'Супы',
        'Горячее',
        'Другое'
    ]
    const dishes: Dish[] = [
        new Dish(1, 'Dish 1', 123, 'Description', '100 kg', [], food_placeholder),
        new Dish(2, 'Dish 2', 123, 'Description', '100 kg', [], food_placeholder),
        new Dish(3, 'Dish 3', 123, 'Description', '100 kg', [], food_placeholder),
        new Dish(4, 'Dish 4', 123, 'Description', '100 kg', [], food_placeholder),
        new Dish(5, 'Dish 5', 123, 'Description', '100 kg', [], food_placeholder),
    ]
    return (
        <section>
            <div className={'sticky top-0 bg-primary-100 z-10 py-3'}>
                <h2 className={'text-accent-800 font-bold text-3xl ml-5 my-5 align-middle'}>{title}</h2>
                <nav>
                    <ul className={'flex gap-3 overflow-x-scroll pb-1 px-5 no-scrollbar'}>
                        {categories.map((category, index) => {
                            return <Chip text={category} key={index}/>
                        })}
                    </ul>
                </nav>
            </div>
            <ul className={'mx-5 gap-5 flex flex-col mt-5'}>
                {dishes.map((dish) => {
                    return (
                        <DishCard dish={dish} key={dish.id}/>
                    )
                })}
            </ul>
        </section>

    );
};