import { IOrderEntry } from './IOrderEntry.ts'
import { WithId } from './types.ts'

export interface IClient extends WithId {
    tableId: number
    restaurantId: number
    id: string
    name: string | null
    isActive: boolean
    assignedEmployeeId: string
    discount?: number
    tip?: number
    paymentType?: number | null
    paymentMethod?: number
    order?: IOrderEntry[]
}
