import { WithId } from './types.ts'
import { IEmployee } from './IEmployee.ts'
import { IClient } from './IClient.ts'

/**
 * Enum for the status of a table
 * @enum {number}
 * @property {number} OPEN - The table is open and available
 * @property {number} OCCUPIED - The table is currently occupied
 * @property {number} RESERVED - The table is reserved for a customer
 */
export enum TableStatus {
    OPEN,
    OCCUPIED,
    RESERVED,
}

/**
 * Interface for a table
 * @interface
 * @property {string} id - The id of the table
 * @property {string} name - The name of the table
 * @property {IDish[]} order - The order for the table
 * @property {IEmployee} assignedEmployee - The employee assigned to the table
 * @property {IClient} client - The client assigned to the table
 */
export interface ITable extends WithId {
    id: string
    name: string
    assignedEmployee?: IEmployee
    client?: IClient
}
