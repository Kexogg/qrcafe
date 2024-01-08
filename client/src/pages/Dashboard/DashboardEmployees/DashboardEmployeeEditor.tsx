import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../../hooks/hooks.ts'
import {
    EmployeeRole,
    getEmployeeStub,
    IEmployee,
} from '../../../types/IEmployee.ts'
import {
    createEmployee,
    getEmployeeById,
    updateEmployee,
} from '../../../api/api.ts'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'
import TextField from '../../../components/UI/Input/TextField/TextField.tsx'
import Dropdown from '../../../components/UI/Input/Dropdown/Dropdown.tsx'
import styles from './DashboardEmployeeEditor.module.css'
import { Button } from '../../../components/UI/Button/Button.tsx'

export const DashboardEmployeeEditor = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [error, setError] = useState('')
    const [lastUpdate, setLastUpdate] = useState<number | null>(null)
    const [loading, setLoading] = useState(params.id !== undefined)
    const session = useAppSelector((state) => state.session)
    const [employee, setEmployee] = useState<IEmployee>(getEmployeeStub())
    useEffect(() => {
        if (params.id) {
            getEmployeeById(session.token!, session.restaurantId!, params.id)
                .then((response) => {
                    setEmployee(response)
                })
                .catch((response) => {
                    setError(response.message)
                })
                .finally(() => setLoading(false))
        }
    }, [params.id, session.restaurantId, session.token])

    const onSubmit = () => {
        setLoading(true)

        async function send() {
            return params.id
                ? await updateEmployee(
                      session.token!,
                      session.restaurantId!,
                      employee,
                  )
                : await createEmployee(
                      session.token!,
                      session.restaurantId!,
                      employee,
                  )
        }

        send()
            .then(() => {
                setLastUpdate(Date.now())
            })
            .catch((response) => {
                setError(response.message)
            })
            .finally(() => setLoading(false))
    }
    return (
        <section className={'relative'}>
            <h1>Редактор сотрудников</h1>
            {loading && <LoadingSpinner elementOverlay />}
            {error}
            {employee.id}
            <form className={styles.form}>
                <label>
                    <span>Полное имя</span>
                    <TextField
                        dark
                        defaultValue={employee.fullName}
                        onChange={(event) =>
                            setEmployee((e) => ({
                                ...e,
                                fullName: event.target.value,
                            }))
                        }
                    />
                </label>
                <label>
                    <span>Логин</span>
                    <TextField
                        dark
                        defaultValue={employee.login}
                        onChange={(event) =>
                            setEmployee((e) => ({
                                ...e,
                                login: event.target.value,
                            }))
                        }
                    />
                </label>
                <label>
                    <span>Пароль</span>
                    <TextField
                        dark
                        onChange={(event) =>
                            setEmployee((e) => ({
                                ...e,
                                password: event.target.value,
                            }))
                        }
                    />
                </label>
                <label>
                    <span>Должность</span>
                    <Dropdown
                        dark
                        defaultValue={
                            employee.role === EmployeeRole.WAITER
                                ? 'Официант'
                                : 'Администратор'
                        }
                        options={['Официант', 'Администратор']}
                        onChange={(event) => {
                            setEmployee((e) => ({
                                ...e,
                                role:
                                    event.target.value === 'Официант'
                                        ? EmployeeRole.WAITER
                                        : EmployeeRole.ADMIN,
                            }))
                        }}
                    />
                </label>
                <label>
                    На смене
                    <input
                        type={'checkbox'}
                        className={'w-min'}
                        onChange={(event) =>
                            setEmployee((e) => ({
                                ...e,
                                available: event.target.checked,
                            }))
                        }
                    />
                </label>
                <div className={'col-span-2 flex gap-3'}>
                    <Button label={'Сохранить'} dark onClick={onSubmit} />
                    <Button
                        label={'Назад'}
                        border
                        onClick={() => navigate(-1)}
                    />
                </div>
                {lastUpdate && (
                    <p>
                        Обновлено в {new Date(lastUpdate).toLocaleTimeString()}
                    </p>
                )}
            </form>
        </section>
    )
}
