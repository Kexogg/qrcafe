import axios from 'axios'
import { IEmployee } from '../types/IEmployee.ts'
import { IDish } from '../types/IDish.ts'

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
    roleId: string,
) => {
    return api
        .post(
            `/restaurants/${restaurantId}/employees`,
            {
                fullName,
                login,
                password,
                roleId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )
        .then((response) => response)
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

export const getFood = async (token: string, restaurantId: string) => {
    return api
        .get(`/restaurants/${restaurantId}/food`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) =>
            response.data.map(
                (food: {
                    id: string
                    isAvailable: boolean
                    name: string
                    description: string
                    weight: number
                    price: number
                }) => {
                    return {
                        id: food.id,
                        name: food.name,
                        description: food.description,
                        weight: food.weight.toString(),
                        price: food.price,
                        available: food.isAvailable,
                        image: '', //TODO: remove
                        extras: [],
                        status: 0,
                        count: 0,
                    } as IDish
                },
            ),
        )
}

export const getFoodById = async (
    token: string,
    restaurantId: string,
    foodId: string,
) => {
    return api
        .get(`/restaurants/${restaurantId}/food/${foodId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            return {
                id: response.data.id,
                name: response.data.name,
                description: response.data.description,
                weight: response.data.weight.toString(),
                price: response.data.price,
                available: response.data.isAvailable,
                image: '', //TODO: remove
                extras: [],
                status: 0,
                count: 0,
            } as IDish
        })
}

export const createFood = async (
    token: string,
    restaurantId: string,
    dish: IDish,
) => {
    return api
        .post(
            `/restaurants/${restaurantId}/food`,
            {
                name: dish.name,
                description: dish.description,
                weight: dish.weight,
                price: dish.price,
                available: true,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )
        .then((response) => response)
}
export const updateFood = async (
    token: string,
    restaurantId: string,
    dish: IDish,
) => {
    return api
        .patch(
            `/restaurants/${restaurantId}/food/${dish.id}`,
            {
                id: dish.id,
                name: dish.name,
                description: dish.description,
                weight: dish.weight,
                price: dish.price,
                isAvailable: dish.available,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )
        .then((response) => response)
}
export const deleteFood = async (
    token: string,
    restaurantId: string,
    foodId: string,
) => {
    return api.delete(`/restaurants/${restaurantId}/food/${foodId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}
