import axios from 'axios'

const API_BASE_URL = 'https://nyashdev.stk8s.66bit.ru/api'

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
