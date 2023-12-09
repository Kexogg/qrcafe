import { DishStatus, getDishTotal, IDish } from './types/IDish.ts'

export function getFilteredCart(cart: IDish[], status: DishStatus) {
    return cart.filter((item) => item.status === status)
}

export function getCartTotal(cart: IDish[]) {
    return cart.reduce((acc, dish) => acc + getDishTotal(dish), 0)
}