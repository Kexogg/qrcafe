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
    return api.post(`/restaurants/${restaurant}/login`, {
        login,
        password,
    })
}

export const getTables = async (token: string, restaurantId: string) => {
    return api.get(`/restaurants/${restaurantId}/tables`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}
