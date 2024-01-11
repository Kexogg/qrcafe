import { WithId } from './types.ts'
import { IDish } from './IDish.ts'

export interface IOrderEntry extends WithId {
    id: string
    clientId: string
    food: IDish
    tableId: number
    createdAt: string
    state: number
    count: number
}
