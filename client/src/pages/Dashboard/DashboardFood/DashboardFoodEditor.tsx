import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { IDish, getDishStub } from '../../../types/IDish.ts'
import { createFood, getFoodById, updateFood } from '../../../api/api.ts'
import { useAppSelector } from '../../../hooks/hooks.ts'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'
import TextField from '../../../components/UI/Input/TextField/TextField.tsx'
import { TextArea } from '../../../components/UI/Input/TextArea/TextArea.tsx'
import { Button } from '../../../components/UI/Button/Button.tsx'
import styles from './DashboardFoodEditor.module.css'
export const DashboardFoodEditor = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [dish, setDish] = useState<IDish>(getDishStub())
    const [error, setError] = useState('')
    const [lastUpdate, setLastUpdate] = useState<number | null>(null)
    const [loading, setLoading] = useState(params.id !== undefined)
    const session = useAppSelector((state) => state.session)
    useEffect(() => {
        if (params.id) {
            getFoodById(session.token!, session.restaurantId!, params.id)
                .then((response) => {
                    setDish(response)
                })
                .catch((response) => {
                    setError(response.message)
                })
                .finally(() => setLoading(false))
        }
    }, [params.id, session.restaurantId, session.token])
    async function send() {
        if (params.id) {
            console.log('Updating food', dish)
            updateFood(session.token!, session.restaurantId!, dish).then(
                (r) => r,
            )
        } else {
            createFood(session.token!, session.restaurantId!, dish).then(
                (r) => r,
            )
        }
    }
    const onSubmit = () => {
        setLoading(true)
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
            {loading && <LoadingSpinner elementOverlay />}
            <h1>Редактор блюд</h1>
            {error}
            <form className={`${styles.form}`}>
                <label>
                    <span>Название</span>
                    <TextField
                        dark
                        defaultValue={dish?.name}
                        onChange={(e) =>
                            setDish((d) => ({ ...d, name: e.target.value }))
                        }
                    />
                </label>
                <label>
                    <span>Описание</span>
                    <TextArea
                        defaultValue={dish?.description}
                        onChange={(e) =>
                            setDish((d) => ({
                                ...d,
                                description: e.target.value,
                            }))
                        }
                    />
                </label>
                <label>
                    <span>Доступно</span>
                    <input
                        type={'checkbox'}
                        className={'w-fit'}
                        checked={dish.available}
                        onChange={(e) =>
                            setDish((d) => ({
                                ...d,
                                available: e.target.checked,
                            }))
                        }
                    />
                </label>
                <label>
                    <span>Цена:</span>
                    <TextField
                        dark
                        type={'number'}
                        defaultValue={dish?.price}
                        onChange={(e) =>
                            setDish((d) => ({
                                ...d,
                                price: Number(e.target.value),
                            }))
                        }
                    />
                </label>
                <label>
                    <span>Вес</span>
                    <TextField
                        dark
                        defaultValue={dish?.weight}
                        type={'number'}
                        onChange={(e) =>
                            setDish((d) => ({ ...d, weight: e.target.value }))
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
