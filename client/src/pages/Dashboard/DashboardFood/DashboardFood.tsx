import { IDish } from '../../../types/IDish.ts'
import { useEffect, useState } from 'react'
import { Table } from '../../../components/UI/Table/Table.tsx'
import { deleteFood, getFood } from '../../../api/api.ts'
import { useAppSelector } from '../../../hooks/hooks.ts'
import { TableButton } from '../../../components/UI/TableButton/TableButton.tsx'
import { useNavigate } from 'react-router-dom'
import {
    AddRounded,
    DeleteRounded,
    EditRounded,
    RefreshRounded,
} from '@mui/icons-material'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'

export const DashboardFood = () => {
    const [food, setFood] = useState<IDish[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [lastUpdate, setLastUpdate] = useState(Date.now())
    const [selectedFood, setSelectedFood] = useState<IDish[]>([])
    const navigate = useNavigate()
    const session = useAppSelector((state) => state.session)

    useEffect(() => {
        setLoading(true)
        getFood(session.token as string, session.restaurantId as string)
            .then((response) => {
                setFood(response)
            })
            .catch((response) => {
                setError(response.message)
            })
            .finally(() => setLoading(false))
    }, [session.restaurantId, session.token, lastUpdate])
    return (
        <section className={'relative'}>
            {loading && <LoadingSpinner elementOverlay />}
            <h1>Блюда</h1>
            {error}
            <div
                className={`flex flex-col gap-3 ${
                    loading && 'animate-pulse opacity-75'
                }`}>
                <Table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Название</th>
                            <th>Цена</th>
                            <th>Описание</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {food.map((dish) => (
                            <tr key={dish.id}>
                                <td className={'w-0'}>
                                    <input
                                        type={'checkbox'}
                                        onChange={(e) =>
                                            e.target.checked
                                                ? setSelectedFood([
                                                      ...selectedFood,
                                                      dish,
                                                  ])
                                                : setSelectedFood(
                                                      selectedFood.filter(
                                                          (f) =>
                                                              f.id !== dish.id,
                                                      ),
                                                  )
                                        }
                                    />
                                </td>
                                <td>{dish.name}</td>
                                <td>{dish.price}</td>
                                <td>{dish.description}</td>
                                <td className={'w-0'}>
                                    <TableButton
                                        onClick={() =>
                                            navigate(`edit/${dish.id}`)
                                        }>
                                        <EditRounded fontSize={'small'} />
                                    </TableButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className={'flex gap-2'}>
                    {' '}
                    <TableButton
                        onClick={() => {
                            setLoading(true)
                            for (const dish of selectedFood) {
                                deleteFood(
                                    session.token!,
                                    session.restaurantId!,
                                    dish.id,
                                )
                                    .then(() => setLastUpdate(Date.now()))
                                    .catch((e) => {
                                        setError(e.message)
                                    })
                                    .finally(() => setLoading(false))
                            }
                        }}>
                        <DeleteRounded />
                    </TableButton>
                    <TableButton
                        onClick={() => {
                            setLastUpdate(Date.now())
                        }}>
                        <RefreshRounded />
                    </TableButton>
                    <TableButton
                        onClick={() => {
                            navigate('edit')
                        }}>
                        <AddRounded />
                    </TableButton>
                </div>
                <small>
                    Обновлено: {new Date(lastUpdate).toLocaleTimeString()}
                </small>
            </div>
        </section>
    )
}
