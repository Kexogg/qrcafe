import {Chip} from "../Chip/Chip.tsx";
import food_placeholder from "/public/food_placeholder.jpg";
import {Dish} from "../../../types/Dish.ts";
import DishCard from "../DishCard/DishCard.tsx";
import {useEffect, useRef, useState} from "react";

type CatalogProps = {
    title: string;
}

interface Category {
    name: string;
    dishes: Dish[];
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
                new Dish(i, 'Dish', 1000, 'Description', '100 kg', [], food_placeholder),
                new Dish(i + 1, 'Dish', 1000, 'Description', '100 kg', [], food_placeholder),
                new Dish(i + 2, 'Dish', 1000, 'Description', '100 kg', [], food_placeholder),
            ]
        })
        i += 3
    }


    const [activeCategory, setActiveCategory] = useState<string>(category_names[0]);
    const categoryRefs = useRef<(HTMLLIElement | null)[]>([]);
    const headerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const refs = categoryRefs.current;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveCategory(entry.target.id);
                }
            });
        }, { threshold: 1 });

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
            window.scrollTo({ top: categoryRef?.offsetTop - headerRef.current.offsetHeight, behavior: 'smooth'});
        }
    }

    return (
        <section>
            <div className={'sticky top-0 bg-primary-100 z-10 py-3'} ref={headerRef}>
                <h2 className={'text-accent-800 font-bold text-3xl ml-5 my-5 align-middle'}>{title}</h2>
                <nav>
                    <ul className={'flex gap-3 overflow-x-scroll pb-1 px-5 no-scrollbar'}>
                        {categories.map((category) => {
                            return <Chip active={category.name === activeCategory} text={category.name} key={category.name} onClick={() => scrollToCategory(category.name)}/>
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
                                                <DishCard dish={dish} key={dish.id}/>
                                            )
                                        })
                                    }
                                </ul>
                            </li>
                        )
                    })
                }
            </ul>
        </section>

    );
};