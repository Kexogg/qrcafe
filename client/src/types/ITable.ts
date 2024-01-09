import { DishStatus, getPlaceholderDish, IDish } from './IDish.ts'
import { WithId } from './types.ts'

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
export interface ITable extends WithId {
    id: string
    name: string
    status: TableStatus
    order: IDish[]
    customerName?: string
    assignedWaiter?: string
}

export function getPlaceholderTables(): ITable[] {
    const tables: ITable[] = []
    for (let i = 0; i < 10; i++) {
        const isOccupied = Math.round(Math.random()) === 0
        isOccupied
            ? tables.push({
                  id: Math.random().toString(),
                  name: 'Столик ' + (i + 1),
                  order: [
                      { ...getPlaceholderDish(), status: DishStatus.COOKING },
                      { ...getPlaceholderDish(), status: DishStatus.COOKED },
                      { ...getPlaceholderDish(), status: DishStatus.SERVED },
                      { ...getPlaceholderDish(), status: DishStatus.CANCELED },
                  ],
                  status: TableStatus.OCCUPIED,
                  assignedWaiter: Math.round(Math.random()).toString(),
              })
            : tables.push({
                  id: Math.random().toString(),
                  name: 'Столик ' + (i + 1),
                  order: [],
                  status: TableStatus.OPEN,
              })
    }
    return tables
}
