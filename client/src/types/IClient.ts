import { IOrderEntry } from './IOrderEntry.ts'

export interface IClient {
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
