import { DishStatus, getPlaceholderDish, IDish } from './IDish.ts'
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
    order: IDish[]
    assignedEmployee?: IEmployee
    client?: IClient
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
                  assignedEmployee: undefined,
                  client: undefined,
              })
            : tables.push({
                  id: Math.random().toString(),
                  name: 'Столик ' + (i + 1),
                  order: [],
                  client: undefined,
              })
    }
    return tables
}
