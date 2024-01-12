import { WithId } from './types.ts'

export enum EmployeeRole {
    ADMIN,
    WAITER,
}
export interface IEmployee extends WithId {
    id: string
    login: string
    password?: string
    fullName: string
    role: EmployeeRole
    available: boolean
    imageUri?: string
}
