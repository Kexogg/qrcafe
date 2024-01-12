import { getOrderEntryTotal, IDish } from './types/IDish.ts'
import { FoodStatus, IOrderEntry } from './types/IOrderEntry.ts'

export function getFilteredCart(cart: IOrderEntry[], status: FoodStatus) {
    return cart.filter((item) => item.state === status)
}

export function getCartTotal(cart: IOrderEntry[]) {
    return cart.reduce((acc, dish) => acc + getOrderEntryTotal(dish), 0)
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
