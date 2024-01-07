import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
    baseURL: API_BASE_URL,
})

export const getToken = async (
    login: string,
    password: string,
    restaurant: string,
) => {
    return api.post(`/restaurants/${restaurant}/employees/login`, {
        login,
        password,
    })
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
