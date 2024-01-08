import { IDish } from './IDish.ts'

export interface ICategory {
    name: string
    id: string
    dishes: IDish[]
}
