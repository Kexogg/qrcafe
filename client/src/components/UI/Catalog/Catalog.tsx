import { IDish } from '../../../types/IDish.ts'
import DishCard from '../DishCard/DishCard.tsx'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import DishModal from '../Modal/DishModal.tsx'
import { Searchbar } from '../Searchbar/Searchbar.tsx'
import { ICategory } from '../../../types/ICategory.ts'
import { useAppSelector } from '../../../hooks/hooks.ts'

type CatalogProps = {
    title: string
    categories: ICategory[]
}

export const Catalog = ({ title, categories }: CatalogProps) => {
    const [activeCategory, setActiveCategory] = useState<string>(
        categories[0].name,
    )
    const [selectedDish, setSelectedDish] = useState<IDish | null>(null)
    const categoryRefs = useRef<(HTMLLIElement | null)[]>([])
    const headerRef = useRef<HTMLUListElement>(null)
    const chipRefs = useRef<(HTMLLIElement | null)[]>([])

    const [searchTerm, setSearchTerm] = useState('')
    const [filteredCategories, setFilteredCategories] = useState(categories)
    const isCustomer = useAppSelector((state) => state.session.type === 1)
    useEffect(() => {
        setFilteredCategories(
            categories
                .map((category) => {
                    return {
                        ...category,
                        dishes: category.foodList.filter((dish) =>
                            dish.name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()),
                        ),
                    }
                })
                .filter((category) => category.dishes.length > 0),
        )
    }, [categories, searchTerm])

    useEffect(() => {
        const refs = categoryRefs.current
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (
                        entry.isIntersecting &&
                        (entry.target as HTMLLIElement).dataset.categoryId
                    ) {
                        setActiveCategory(
                            (entry.target as HTMLLIElement).dataset
                                .categoryId as string,
                        )
                        scrollToChip(
                            (entry.target as HTMLLIElement).dataset
                                .categoryId as string,
                        )
                    }
                })
            },
            {
                threshold: 0.75,
                rootMargin: `0px ${
                    (headerRef.current?.offsetHeight && +1) ?? '0'
                }px 0px 0px`,
            },
        )

        categoryRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref)
        })

        return () => {
            for (const ref of refs) {
                if (ref) observer.unobserve(ref)
            }
        }
    }, [])

    const scrollToCategory = (categoryId: string) => {
        const categoryRef = categoryRefs.current.find(
            (ref) => ref?.dataset.categoryId === categoryId,
        )
        if (headerRef.current?.offsetHeight && categoryRef) {
            window.scrollTo({
                top: categoryRef?.offsetTop - headerRef.current.offsetHeight,
                behavior: 'smooth',
            })
        }
    }
    const scrollToChip = (categoryId: string) => {
        const chipRef = chipRefs.current.find(
            (ref) => ref?.dataset.categoryId === categoryId,
        )
        if (headerRef.current?.offsetHeight && chipRef) {
            headerRef.current.scrollTo({
                left:
                    chipRef?.offsetLeft -
                    headerRef.current.offsetWidth / 2 +
                    chipRef.offsetWidth / 2,
                behavior: 'smooth',
            })
        }
    }

    return (
        <section>
            <DishModal
                dish={selectedDish}
                onClose={() => setSelectedDish(null)}
            />
            <h2
                className={
                    'my-5 ml-5 align-middle text-3xl font-bold text-accent-800'
                }>
                {title}
            </h2>
            <div className={'mx-5'}>
                <Searchbar setSearchTerm={setSearchTerm} />
            </div>
            <nav className={'sticky top-0 z-10 bg-primary-100'}>
                <ul
                    className={'no-scrollbar flex gap-3 overflow-x-scroll p-5'}
                    ref={headerRef}>
                    {filteredCategories.map((category, index) => {
                        return (
                            <li
                                data-category-id={category.id}
                                key={category.id}
                                ref={(el) => (chipRefs.current[index] = el)}>
                                <button
                                    className={`border-2 border-primary-700 px-3 py-1 ${
                                        category.id === activeCategory
                                            ? ' bg-primary-700 text-primary-50'
                                            : 'text-primary-700'
                                    } inline-block rounded-full text-center text-lg font-medium`}
                                    onClick={() =>
                                        scrollToCategory(category.id)
                                    }>
                                    {category.name}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </nav>
            <ul className={'mx-5 mt-5 flex flex-col gap-5'}>
                {filteredCategories.map((category, index) => {
                    return (
                        <li
                            data-category-id={category.id}
                            key={category.id}
                            ref={(el) => (categoryRefs.current[index] = el)}>
                            <h3
                                className={
                                    'my-2 align-middle text-2xl font-bold text-accent-800'
                                }>
                                {category.name}
                            </h3>
                            <ul className={'flex flex-wrap gap-5'}>
                                {category.foodList.map((dish) => {
                                    return (
                                        <DishCard
                                            onClick={() => {
                                                setSelectedDish(dish)
                                            }}
                                            dish={dish}
                                            key={dish.id}
                                        />
                                    )
                                })}
                            </ul>
                        </li>
                    )
                })}
            </ul>
            {isCustomer && (
                <section className={'my-6 text-center text-primary-700'}>
                    <h3> Похоже, что вы просмотрели все блюда </h3>
                    <p>
                        Вы можете перейти в{' '}
                        <Link className={'underline'} to={'/customer/cart'}>
                            корзину
                        </Link>{' '}
                        и оформить заказ
                    </p>
                </section>
            )}
        </section>
    )
}
