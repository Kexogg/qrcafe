import axios from 'axios'
import { EmployeeRole, IEmployee } from '../types/IEmployee.ts'
import { IDish } from '../types/IDish.ts'
import { ITable } from '../types/ITable.ts'
import { ICategory } from '../types/ICategory.ts'

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
        .then((response) => response.data as ITable[])
}

export const getTableById = async (
    token: string,
    restaurantId: string,
    tableId: string,
) => {
    return api
        .get(`/restaurants/${restaurantId}/tables/${tableId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.data as ITable)
}

export const createTable = async (
    token: string,
    restaurantId: string,
    table: ITable,
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
                    name: table.name,
                },
            },
        )
        .then((response) => response.data)
}

export const updateTable = async (
    token: string,
    restaurantId: string,
    table: ITable,
) => {
    return api
        .patch(
            `/restaurants/${restaurantId}/tables/${table.id}`,
            {
                name: table.name,
                assignedEmployeeId: table.assignedWaiter,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )
        .then((response) => response)
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

export const getEmployeeById = async (
    token: string,
    restaurantId: string,
    employeeId: string,
) => {
    return api
        .get(`/restaurants/${restaurantId}/employees/${employeeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            return {
                id: response.data.id,
                login: response.data.login,
                fullName: response.data.fullName,
                role: response.data.roleId,
                available: response.data.available,
            } as IEmployee
        })
}

export const createEmployee = async (
    token: string,
    restaurantId: string,
    employee: IEmployee,
) => {
    return api
        .post(
            `/restaurants/${restaurantId}/employees`,
            {
                fullName: employee.fullName,
                login: employee.login,
                password: employee.password,
                roleId: employee.role,
                available: employee.available,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )
        .then((response) => response)
}

export const updateEmployee = async (
    token: string,
    restaurantId: string,
    employee: IEmployee,
) => {
    return api
        .patch(
            `/restaurants/${restaurantId}/employees/${employee.id}`,
            {
                ...{
                    fullName: employee.fullName,
                    login: employee.login,
                    roleId:
                        typeof employee.role === 'string' //TODO: fix later
                            ? Object.values(EmployeeRole).indexOf(employee.role)
                            : employee.role,
                    available: employee.available,
                },
                ...(employee.password && { password: employee.password }),
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
                    available: boolean
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
                        available: food.available,
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
                available: response.data.available,
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
                available: dish.available,
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
                available: dish.available,
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

export const getCategories = async (token: string, restaurantId: string) => {
    return api
        .get(`/restaurants/${restaurantId}/categories`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.data)
}

export const createCategory = async (
    token: string,
    restaurantId: string,
    category: ICategory,
) => {
    return api
        .post(
            `/restaurants/${restaurantId}/categories`,
            {
                name: category.name,
                description: category.description,
                separate: category.separate,
                order: category.order,
                available: category.available,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )
        .then((response) => response)
}

export const getCategoryById = async (
    token: string,
    restaurantId: string,
    categoryId: string,
) => {
    return api
        .get(`/restaurants/${restaurantId}/categories/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            return {
                id: response.data.id,
                name: response.data.name,
                description: response.data.description,
                separate: response.data.separate,
                order: response.data.order,
                available: response.data.available,
                foodList: response.data.foodList ?? [],
            } as ICategory
        })
}

export const deleteCategory = async (
    token: string,
    restaurantId: string,
    categoryId: string,
) => {
    return api.delete(`/restaurants/${restaurantId}/categories/${categoryId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const updateCategory = async (
    token: string,
    restaurantId: string,
    category: ICategory,
) => {
    return api
        .put(
            `/restaurants/${restaurantId}/categories/${category.id}/food`,
            {
                name: category.name,
                description: category.description,
                separate: category.separate,
                order: category.order,
                available: category.available,
                foodIdList: category.foodList.map((f) => f.id) ?? [],
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )
        .then((response) => response)
}

export const getOrders = async (token: string, restaurantId: string) => {
    return api
        .get(`/restaurants/${restaurantId}/foodQueue`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.data)
}

export const getOrder = async (token: string, restaurantId: string) => {
    return api
        .get(`/restaurants/${restaurantId}/foodQueue`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.data)
}

export const getOrderById = async (
    token: string,
    restaurantId: string,
    orderId: string,
) => {
    return api
        .get(`/restaurants/${restaurantId}/foodQueue/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.data)
}

export const createOrder = async (
    token: string,
    restaurantId: string,
    order: IDish[],
) => {
    return api
        .post(`/restaurants/${restaurantId}/foodQueue`, order, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response)
}

export const getCatalog = async (token: string, restaurantId: string) => {
    return api
        .get(`/restaurants/${restaurantId}/categories/food`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.data)
}

export const getClients = async (token: string, restaurantId: string) => {
    return api
        .get(`/restaurants/${restaurantId}/clients`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.data)
}
