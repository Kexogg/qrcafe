import axios from 'axios'
import { IEmployee } from '../types/IEmployee.ts'

const API_BASE_URL = '/api'

const api = axios.create({
    baseURL: API_BASE_URL,
})

export const getEmployeeToken = async (
    login: string,
    password: string,
    restaurant: string,
) => {
    return api.post(`/restaurants/${restaurant}/employees/login`, {
        login,
        password,
    })
}

export const getClientToken = async (restaurant: string, tableId: string) => {
    return api.post(`/restaurants/${restaurant}/clients/tables/${tableId}`, {})
}

export const getTables = async (token: string, restaurantId: string) => {
    return api
        .get(`/restaurants/${restaurantId}/tables`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) =>
            response.data.map(
                (table: {
                    id: string
                    name: string
                    assignedEmployeeId: string
                }) => {
                    return {
                        id: table.id.toString(),
                        name: table.name,
                        assignedWaiter: table.assignedEmployeeId || null,
                    }
                },
            ),
        )
}
export const createTable = async (
    token: string,
    restaurantId: string,
    name: string,
) => {
    return api
        .post(
            `/restaurants/${restaurantId}/tables`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    name,
                },
            },
        )
        .then((response) => response.data)
}
export const deleteTable = async (
    token: string,
    restaurantId: string,
    tableId: string,
) => {
    return api.delete(`/restaurants/${restaurantId}/tables/${tableId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const getEmployees = async (token: string, restaurantId: string) => {
    return api
        .get(`/restaurants/${restaurantId}/employees`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(
            (response) =>
                response.data.map(
                    (employee: {
                        id: string
                        fullName: string
                        login: string
                        roleId: string
                        available: boolean
                    }) => {
                        return {
                            id: employee.id,
                            login: employee.login,
                            fullName: employee.fullName,
                            role: employee.roleId,
                            available: employee.available,
                        }
                    },
                ) as IEmployee[],
        )
}

export const createEmployee = async (
    token: string,
    restaurantId: string,
    fullName: string,
    login: string,
    password: string,
    role: number,
) => {
    console.log('createEmployee', token, restaurantId, fullName, login, role)
    return api
        .post(
            `/restaurants/${restaurantId}/employees`,
            {
                fullName,
                login,
                password,
                role,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )
        .then((response) => response.data)
}
export const deleteEmployee = async (
    token: string,
    restaurantId: string,
    employeeId: string,
) => {
    return api.delete(`/restaurants/${restaurantId}/employees/${employeeId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}
