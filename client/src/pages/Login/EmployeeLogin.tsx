import { useState } from 'react'
import { useAppDispatch } from '../../hooks.ts'
import { useNavigate } from 'react-router-dom'
import { setSession } from '../../features/session/sessionSlice.ts'
import TextField from '../../components/UI/TextField/TextField.tsx'
import { Button } from '../../components/UI/Button/Button.tsx'

export const EmployeeLogin = () => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [restaurant, setRestaurant] = useState('')
    const [error, setError] = useState('' as string | null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const fetchToken = (login: string, password: string) => {
        fetch(`/api/restaurants/${restaurant}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: login,
                password: password,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    return Promise.reject(response)
                }
                return response.json()
            })
            .then((data) => {
                dispatch(
                    setSession({
                        type: 0,
                        token: data.access_token,
                        tokenTimestamp: new Date(),
                        restaurantId: restaurant,
                    }),
                )
                setError('')
                navigate('/employee/home')
            })
            .catch((response) => {
                if (response.status == 401)
                    setError('Неверный логин или пароль')
                else if (response.status)
                    setError(
                        `Произошла ошибка при авторизации, код ${response.status}`,
                    )
                else setError('Произошла неизвестная ошибка')
            })
    }

    return (
        <form className={'flex h-full flex-col'}>
            <h1>Авторизация сотрудника</h1>
            <div className={'mt-5 flex flex-col gap-3'}>
                <TextField
                    placeholder={'Введите код ресторана'}
                    onChange={(e) => setRestaurant(e.target.value)}
                />
                <TextField
                    type={'text'}
                    placeholder={'Введите логин'}
                    onChange={(e) => setLogin(e.target.value)}
                />
                <TextField
                    type={'password'}
                    placeholder={'Введите пароль'}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <span>{error}</span>
            </div>
            <div className={'mt-auto flex w-full flex-col'}>
                <Button
                    onClick={() => fetchToken(login, password)}
                    label={'Войти'}
                />
            </div>
        </form>
    )
}
