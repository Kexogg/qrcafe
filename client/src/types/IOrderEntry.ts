import { IDish } from './IDish.ts'

export enum FoodStatus {
    NONE,
    NEW,
    COOKING,
    COOKED,
    SERVED,
    CANCELED,
}

export interface IOrderEntry {
    id?: string
    food: IDish
    createdAt: string
    state: FoodStatus
    count: number
}
