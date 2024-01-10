import { DishStatus, getDishTotal, IDish } from './types/IDish.ts'

export function getFilteredCart(cart: IDish[], status: DishStatus) {
    return cart.filter((item) => item.status === status)
}

export function getCartTotal(cart: IDish[]) {
    return cart.reduce((acc, dish) => acc + getDishTotal(dish), 0)
}

export function getAppliedDishExtras(dish: IDish) {
    return dish.extras
        .filter((extra) => extra.applied)
        .map((extra) => extra.name)
        .join(', ')
}

export const getQRValue = (restaurantId: string, id: string) => {
    const params = new URLSearchParams({
        id: restaurantId as string,
        table: id,
    })
    return `https://${window.location.hostname}/login?${params.toString()}`
}
