import { IDish } from './IDish.ts'
import { WithId } from './types.ts'

export interface ICategory extends WithId {
    id: string
    name: string
    description: string
    separate: boolean
    order: number
    food: IDish[]
}
