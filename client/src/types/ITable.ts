import { IDish } from './IDish.ts'

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
 * Interface for a table in a restaurant
 * @interface
 * @property {string} id - The unique identifier for the table
 * @property {string} name - The name of the table
 * @property {TableStatus} status - The current status of the table (OPEN, OCCUPIED, RESERVED)
 * @property {IDish[]} order - The array of dishes ordered at the table
 * @property {string} [customerName] - The name of the customer (optional)
 * @property {string} [assignedWaiter] - ID of the waiter assigned to the table
 */
export interface ITable {
    id: string
    name: string
    status: TableStatus
    order: IDish[]
    customerName?: string
    assignedWaiter?: string
}
