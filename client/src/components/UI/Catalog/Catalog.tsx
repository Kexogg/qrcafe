import {Chip} from "../Chip/Chip.tsx";
import {getPlaceholderDish, IDish} from "../../../types/IDish.ts";
import DishCard from "../DishCard/DishCard.tsx";
import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import DishModal from "../Modal/DishModal.tsx";

type CatalogProps = {
    title: string;
}

interface Category {
    name: string;
    dishes: IDish[];
}

export const Catalog = ({title}: CatalogProps) => {
    const category_names: string[] = [
        'Салаты',
        'Десерты',
        'Закуски',
        'Супы',
        'Горячее',
        'Другое'
    ]
    const categories: Category[] = []
    //fake data generator
    //TODO: replace with real data
    let i = 0
    for (const categoryName of category_names) {
        categories.push({
            name: categoryName,
            dishes: [
                getPlaceholderDish(),
            ]
        })
        i += 3
    }


    const [activeCategory, setActiveCategory] = useState<string>(category_names[0]);
    const [selectedDish, setSelectedDish] = useState<IDish | null>(null);
    const categoryRefs = useRef<(HTMLLIElement | null)[]>([]);
    const headerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const refs = categoryRefs.current;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveCategory(entry.target.id);
                    scrollToChip(entry.target.id)
                }
            });
        }, {threshold: 1});

        categoryRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            for (const ref of refs) {
                if (ref) observer.unobserve(ref);
            }
        };
    }, []);

    const scrollToCategory = (category: string) => {
        const categoryRef = categoryRefs.current.find((ref) => ref?.id === category);
        if (headerRef.current?.offsetHeight && categoryRef) {
            window.scrollTo({top: categoryRef?.offsetTop - headerRef.current.offsetHeight, behavior: 'smooth'});
        }
    }

    const chipRefs = useRef<(HTMLLIElement | null)[]>([]);
    const scrollToChip = (category: string) => {
        const chipRef = chipRefs.current.find((ref) => ref?.id === category);
        chipRef?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }

    return (
        <section>
            <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)}/>
            <div className={'sticky top-0 bg-primary-100 z-10 py-3'} ref={headerRef}>
                <h2 className={'text-accent-800 font-bold text-3xl ml-5 my-5 align-middle'}>{title}</h2>
                <nav>
                    <ul className={'flex gap-3 overflow-x-scroll pb-1 px-5 no-scrollbar'}>
                        {categories.map((category, index) => {
                            return <Chip ref={(el) => chipRefs.current[index] = el} active={category.name === activeCategory} text={category.name}
                                         key={category.name} onClick={() => scrollToCategory(category.name)}/>
                        })}
                    </ul>
                </nav>
            </div>
            <ul className={'mx-5 gap-5 flex flex-col mt-5'}>
                {
                    categories.map((category, index) => {
                        return (
                            <li key={category.name} id={category.name} ref={(el) => categoryRefs.current[index] = el}>
                                <h3 className={'text-accent-800 font-bold text-2xl my-2 align-middle'}>{category.name}</h3>
                                <ul className={'flex gap-5 flex-wrap'}>
                                    {
                                        category.dishes.map((dish) => {
                                            return (
                                                <DishCard onClick={() => {
                                                    setSelectedDish(dish)
                                                }} dish={dish} key={dish.id}/>
                                            )
                                        })
                                    }
                                </ul>
                            </li>
                        )
                    })
                }
            </ul>
            <section className={'text-center my-6 text-primary-700'}>
                <h3> Похоже, что вы просмотрели все блюда </h3>
                <p>Вы можете перейти в <Link className={'underline'} to={'/customer/cart'}>корзину</Link> и оформить
                    заказ</p>
            </section>
        </section>

    );
};