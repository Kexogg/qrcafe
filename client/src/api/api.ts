import axios from 'axios'
import { IEmployee } from '../types/IEmployee.ts'
import { IDish } from '../types/IDish.ts'
import { ITable } from '../types/ITable.ts'
import { ICategory } from '../types/ICategory.ts'
import { IOrderEntry } from '../types/IOrderEntry.ts'

const toFormData = <T>(obj: T) => {
    const formData = new FormData()
    for (const key in obj) {
        if (obj[key] instanceof Array) {
            for (const item of obj[key] as any[]) {
                formData.append(`${key}`, JSON.stringify(item))
            }
        } else if (key !== 'id') formData.append(key, obj[key] as string | Blob)
    }
    console.log(formData)
    return formData
}

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

export const getAssignedEmployee = async (
    token: string,
    restaurant: string,
) => {
    return api
        .get(`/restaurants/${restaurant}/clients/employee`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.data as IEmployee)
}

export const getClientToken = async (restaurant: string, tableId: string) => {
    return api.post(`/restaurants/${restaurant}/clients/tables/${tableId}`, {})
}

export const finishClientSession = async (
    token: string,
    restaurant: string,
) => {
    return api.delete(`/restaurants/${restaurant}/clients`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const getTables = async (token: string, restaurantId: string) => {
    return api
        .get(`/restaurants/${restaurantId}/tables/getAll`, {
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
                        role: string
                        available: boolean
                    }) => {
                        return {
                            id: employee.id,
                            login: employee.login,
                            fullName: employee.fullName,
                            role: employee.role,
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
                role: response.data.role,
                available: response.data.available,
                imageUrl: response.data.imageUrl,
            } as IEmployee
        })
}

export const createEmployee = async (
    token: string,
    restaurantId: string,
    employee: IEmployee,
) => {
    return api
        .post(`/restaurants/${restaurantId}/employees`, toFormData(employee), {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        })
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
            toFormData(employee),
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
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

export const getEmployeeInfo = async (token: string, restaurantId: string) => {
    return api
        .get(`/restaurants/${restaurantId}/employees/info`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            return {
                id: response.data.id,
                login: response.data.login,
                fullName: response.data.fullName,
                role: response.data.role,
                available: response.data.available,
                imageUrl: response.data.imageUrl,
            } as IEmployee
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
                    imageUrl: string
                }) => {
                    return {
                        id: food.id,
                        name: food.name,
                        description: food.description,
                        weight: food.weight.toString(),
                        price: food.price,
                        available: food.available,
                        imageUrl: food.imageUrl,
                        extras: [],
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
                imageUrl: response.data.imageUrl,
                extras: response.data.extras ?? [],
            } as IDish
        })
}

export const createFood = async (
    token: string,
    restaurantId: string,
    dish: IDish,
) => {
    return api
        .post(`/restaurants/${restaurantId}/food`, toFormData(dish), {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        })
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
            toFormData(dish),
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
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
    order: IOrderEntry[],
) => {
    const orderItems = order.map((entry) => {
        return {
            id: Number(entry.food.id),
            count: entry.count,
            extras: entry.food.extras.filter((extra) => extra.applied),
        }
    }, [])
    return api
        .post(`/restaurants/${restaurantId}/foodQueue`, orderItems, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response)
}

export const deleteOrder = async (
    token: string,
    restaurantId: string,
    orderId: string,
) => {
    return api
        .patch(
            `/restaurants/${restaurantId}/foodQueue/${orderId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )
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
export const deleteClient = async (
    token: string,
    restaurantId: string,
    clientId: string,
) => {
    return api.delete(`/restaurants/${restaurantId}/clients/${clientId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const getExtras = async (token: string, restaurantId: string) => {
    return api
        .get(`/restaurants/${restaurantId}/extras`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.data)
}
