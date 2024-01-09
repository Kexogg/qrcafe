import { useState } from 'react'
import { useAppDispatch } from '../../../hooks/hooks.ts'
import { useNavigate } from 'react-router-dom'
import { setSession } from '../../../features/session/sessionSlice.ts'
import TextField from '../../../components/UI/Input/TextField/TextField.tsx'
import { Button } from '../../../components/UI/Button/Button.tsx'
import { getEmployeeToken } from '../../../api/api.ts'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'
export const LoginEmployee = () => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [restaurant, setRestaurant] = useState('')
    const [error, setError] = useState('' as string | null)
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const fetchToken = async (
        login: string,
        password: string,
        restaurant: string,
        sessionType: number,
    ) => {
        setLoading(true)
        getEmployeeToken(login, password, restaurant)
            .then((response) => {
                dispatch(
                    setSession({
                        type: sessionType,
                        token: response.data.token,
                        tokenTimestamp: Date.now(),
                        restaurantId: restaurant,
                    }),
                )
                setError('')
                setLoading(false)
                navigate('/employee/home')
            })
            .catch((response) => {
                setLoading(false)
                if (response.response.status == 401)
                    setError('Неверный логин или пароль')
                else if (response.response.status == 404)
                    setError('Ресторан не найден')
                else if (response.code == 'ERR_NETWORK')
                    setError('Произошла ошибка при подключении к серверу')
                else if (response.response.status)
                    setError(
                        `Произошла ошибка при авторизации, код ${response.response.status}`,
                    )
                else setError('Произошла неизвестная ошибка')
            })
    }

    return (
        <form className={'flex h-full flex-col'}>
            {loading && <LoadingSpinner screenOverlay />}
            <h1>Авторизация сотрудника</h1>
            <div className={'mt-5 flex flex-col gap-3'}>
                <TextField
                    required
                    placeholder={'Введите код ресторана'}
                    onChange={(e) => setRestaurant(e.target.value)}
                />
                <TextField
                    required
                    type={'text'}
                    placeholder={'Введите логин'}
                    onChange={(e) => setLogin(e.target.value)}
                />
                <TextField
                    required
                    type={'password'}
                    placeholder={'Введите пароль'}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <span>{error}</span>
            </div>
            <div className={'mt-auto flex w-full flex-col gap-3'}>
                <Button
                    disabled={
                        login.length == 0 ||
                        password.length == 0 ||
                        restaurant.length == 0
                    }
                    onClick={() => fetchToken(login, password, restaurant, 0)}
                    label={'Войти'}
                />
                <Button
                    disabled={
                        login.length == 0 ||
                        password.length == 0 ||
                        restaurant.length == 0
                    }
                    onClick={() => fetchToken(login, password, restaurant, 2)}
                    label={'Войти (личный кабинет)'}
                />
                <Button
                    label={'Назад'}
                    onClick={() => navigate('/login')}
                    dark
                    border
                />
                {import.meta.env.MODE == 'development' && (
                    <>
                        <Button
                            label={'Пропустить (Waiter)'}
                            onClick={() => {
                                dispatch(
                                    setSession({
                                        type: 0,
                                        token: 'DEBUG',
                                        tokenTimestamp: Date.now(),
                                        restaurantId: '0',
                                    }),
                                )
                                navigate('/employee/home')
                            }}
                            dark
                            border
                        />
                        <Button
                            label={'Пропустить (Dashboard)'}
                            onClick={() => {
                                dispatch(
                                    setSession({
                                        type: 2,
                                        token: 'DEBUG',
                                        tokenTimestamp: Date.now(),
                                        restaurantId: '0',
                                    }),
                                )
                                navigate('/dashboard/home')
                            }}
                            dark
                            border
                        />
                    </>
                )}
            </div>
        </form>
    )
}
