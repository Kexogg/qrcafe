import { IDish } from './IDish.ts'

export interface ICategory {
    id: string
    name: string
    description: string
    separate: boolean
    order: number
    food: IDish[]
}
