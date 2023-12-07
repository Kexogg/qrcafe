import food_placeholder from '/src/assets/food_placeholder.jpg'

export enum DishStatus {
    NONE,
    NEW,
    COOKING,
    COOKED,
    DELIVERED,
    CANCELED,
}

export interface IDish {
    id: string
    cartId?: string
    name: string
    price: number
    description: string
    weight: string
    extras: IDishExtra[]
    image: string
    status: DishStatus
    count: number | undefined //undefined means that the dish is not in the cart
}

export function toggleDishExtra(dish: IDish, id: number): IDishExtra[] {
    return dish.extras.map((extra) => {
        if (extra.id === id) {
            extra.applied = !extra.applied
        }
        return extra
    })
}

export function getDishTotal(dish: IDish) {
    return (
        (dish.price +
            dish.extras
                .filter((extra) => extra.applied)
                .reduce((acc, extra) => acc + extra.price, 0)) *
        (dish.count ?? 1)
    )
}

export function getPlaceholderDish(): IDish {
    const DishNames = [
        'Салат греческий',
        'Салат с креветками',
        'Салат с курицей',
        'Салат с тунцом',
        'Салат с лососем',
        'Салат с мидиями',
        'Салат с кальмарами',
    ]
    const DishExtras = [
        { id: 0, name: 'Сыр', price: 200, applied: false },
        { id: 1, name: 'Соус', price: 250, applied: false },
        { id: 2, name: 'Оливки', price: 150, applied: false },
        { id: 3, name: 'Огурцы', price: 100, applied: false },
        { id: 4, name: 'Помидоры', price: 100, applied: false },
        { id: 5, name: 'Лук', price: 50, applied: false },
        { id: 6, name: 'Перец', price: 50, applied: false },
        { id: 7, name: 'Оливковое масло', price: 50, applied: false },
    ]
    const DishName = DishNames[Math.floor(Math.random() * DishNames.length)]
    const DishDescription =
        DishName +
        ', приготовленный по греческому рецепту, с добавлением оливок, сыра фета, огурцов, помидоров, лука, перца и оливкового масла.'
    return {
        id: Math.random().toString(),
        name: DishName,
        price: Math.floor(Math.random() * 100),
        description: DishDescription,
        weight: '100 гр.',
        //@ts-ignore
        extras: DishExtras.filter((value) => Math.random() > 0.5),
        image: food_placeholder,
        count: undefined,
        status: DishStatus.NONE,
    }
}

interface IDishExtra {
    id: number
    name: string
    price: number
    applied: boolean
}
