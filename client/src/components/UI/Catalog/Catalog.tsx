import {getPlaceholderDish, IDish} from "../../../types/IDish.ts";
import DishCard from "../DishCard/DishCard.tsx";
import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import DishModal from "../Modal/DishModal.tsx";
import {Searchbar} from "../Searchbar/Searchbar.tsx";
import {ICategory} from "../../../types/ICategory.ts";

type CatalogProps = {
    title: string;
}

export const Catalog = ({title}: CatalogProps) => {
    //fake data generator
    //TODO: remove later
    const category_names: string[] = [
        'Салаты',
        'Десерты',
        'Закуски',
        'Супы',
        'Горячее',
        'Другое'
    ]
    const categories: ICategory[] = []
        let i = 0;
        for (const categoryName of category_names) {
            categories.push({
                name: categoryName,
                id: i.toString(),
                dishes: [
                    getPlaceholderDish(),
                    getPlaceholderDish(),
                    getPlaceholderDish()
                ]
            })
            i++;
        }

        const [activeCategory, setActiveCategory] = useState<string>(category_names[0]);
        const [selectedDish, setSelectedDish] = useState<IDish | null>(null);
        const categoryRefs = useRef<(HTMLLIElement | null)[]>([]);
        const headerRef = useRef<HTMLUListElement>(null);
        const chipRefs = useRef<(HTMLLIElement | null)[]>([]);

        useEffect(() => {
            const refs = categoryRefs.current;
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && (entry.target as HTMLLIElement).dataset.categoryId) {
                        setActiveCategory((entry.target as HTMLLIElement).dataset.categoryId as string);
                        scrollToChip((entry.target as HTMLLIElement).dataset.categoryId as string)
                    }
                });
            }, {threshold: .75, rootMargin: `0px ${(headerRef.current?.offsetHeight && +1) ?? '0'}px 0px 0px`});

            categoryRefs.current.forEach((ref) => {
                if (ref) observer.observe(ref);
            });

            return () => {
                for (const ref of refs) {
                    if (ref) observer.unobserve(ref);
                }
            };
        }, []);

        const scrollToCategory = (categoryId: string) => {
            const categoryRef = categoryRefs.current.find((ref) => ref?.dataset.categoryId === categoryId);
            if (headerRef.current?.offsetHeight && categoryRef) {
                window.scrollTo({top: categoryRef?.offsetTop - headerRef.current.offsetHeight, behavior: 'smooth'});
            }
        }
        const scrollToChip = (categoryId: string) => {
            const chipRef = chipRefs.current.find((ref) => ref?.dataset.categoryId === categoryId);
            if (headerRef.current?.offsetHeight && chipRef) {
                headerRef.current.scrollTo({left: chipRef?.offsetLeft - headerRef.current.offsetWidth / 2 + chipRef.offsetWidth / 2, behavior: 'smooth'});
            }
        }


        return (
            <section>
                <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)}/>
                <h2 className={'text-accent-800 font-bold text-3xl ml-5 my-5 align-middle'}>{title}</h2>
                <Searchbar/>
                <nav className={'sticky top-0 bg-primary-100 z-10'}>
                    <ul className={'flex gap-3 overflow-x-scroll p-5 no-scrollbar'} ref={headerRef}>
                        {categories.map((category, index) => {
                            return <li data-category-id={category.id} key={category.id} ref={(el) => chipRefs.current[index] = el}>
                                <button
                                    className={`border-2 border-primary-700 py-1 px-3 ${category.id === activeCategory ? ' bg-primary-700 text-primary-50' : 'text-primary-700'} rounded-full text-center font-medium text-lg inline-block`}
                                    onClick={() => scrollToCategory(category.id)}>{category.name}</button>
                            </li>
                        })}
                    </ul>
                </nav>
                <ul className={'mx-5 gap-5 flex flex-col mt-5'}>
                    {
                        categories.map((category, index) => {
                            return (
                                <li data-category-id={category.id} key={category.id} ref={(el) => categoryRefs.current[index] = el}>
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
    }
;