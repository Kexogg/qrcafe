import { WithId } from './types.ts'
import { IOrderEntry } from './IOrderEntry.ts'

export interface IDish extends WithId {
    id: string
    cartId?: string
    name: string
    price: number
    description: string
    weight: string
    extras: IDishExtra[]
    imageUrl: string
    available: boolean
}

export function toggleDishExtra(dish: IDish, id: number): IDishExtra[] {
    return dish.extras.map((extra) => {
        if (extra.id === id) {
            extra.applied = !extra.applied
        }
        return extra
    })
}

export function getOrderEntryTotal(orderEntry: IOrderEntry) {
    return (
        (orderEntry.food.price +
            orderEntry.food.extras
                .filter((extra) => extra.applied)
                .reduce((acc, extra) => acc + extra.price, 0)) *
        (orderEntry.count ?? 1)
    )
}

interface IDishExtra {
    id: number
    name: string
    price: number
    applied: boolean
}
