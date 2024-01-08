import { WithId } from './types.ts'

export enum EmployeeRole {
    ADMIN = 0,
    WAITER = 1,
}
export interface IEmployee extends WithId {
    id: string
    login: string
    password?: string
    fullName: string
    role: number
    available: boolean
}

export const getEmployeeStub = (): IEmployee => {
    return {
        id: '',
        login: '',
        fullName: '',
        role: 1,
        available: false,
    }
}
