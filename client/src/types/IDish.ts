import food_placeholder from "/src/assets/food_placeholder.jpg";

export interface IDish {
    id: number;
    name: string;
    price: number;
    description: string;
    weight: string;
    extras: IDishExtra[];
    image: string;
    count: number | undefined; //undefined means that the dish is not in the cart
}

export function toggleDishExtra(dish: IDish, id: number) {
    const extra = dish.extras.find(extra => extra.id === id);
    if (extra) {
        extra.applied = !extra.applied;
    }
}

export function getDishTotal(dish: IDish) {
    return dish.price + dish.extras.filter(extra => extra.applied).reduce((acc, extra) => acc + extra.price, 0);
}

export function getPlaceholderDish(): IDish {
    const DishNames = [
        'Салат греческий',
        'Салат с креветками',
        'Салат с курицей',
        'Салат с тунцом',
        'Салат с лососем',
        'Салат с мидиями',
        'Салат с кальмарами'
    ]
    const DishExtras = [
        {id: 0, name: 'Сыр', price: 200, applied: false},
        {id: 1, name: 'Соус', price: 250, applied: false},
        {id: 2, name: 'Оливки', price: 150, applied: false},
        {id: 3, name: 'Огурцы', price: 100, applied: false},
        {id: 4, name: 'Помидоры', price: 100, applied: false},
        {id: 5, name: 'Лук', price: 50, applied: false},
        {id: 6, name: 'Перец', price: 50, applied: false},
        {id: 7, name: 'Оливковое масло', price: 50, applied: false}
    ]
    const DishName = DishNames[Math.floor(Math.random() * DishNames.length)];
    const DishDescription = DishName + ', приготовленный по греческому рецепту, с добавлением оливок, сыра фета, огурцов, помидоров, лука, перца и оливкового масла.';
    return {
        id: Math.random(),
        name: DishName,
        price: Math.floor(Math.random() * 100),
        description: DishDescription,
        weight: '100 гр.',
        extras: DishExtras.filter(extra => Math.random() > 0.5),
        image: food_placeholder,
        count: undefined
    };
}


interface IDishExtra {
    id: number;
    name: string;
    price: number;
    applied: boolean;
}
