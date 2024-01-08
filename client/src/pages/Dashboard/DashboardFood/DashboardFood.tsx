import { IDish } from '../../../types/IDish.ts'
import { useEffect, useState } from 'react'
import { deleteFood, getFood } from '../../../api/api.ts'
import { useAppSelector } from '../../../hooks/hooks.ts'
import { TableButton } from '../../../components/UI/TableButton/TableButton.tsx'
import { useNavigate } from 'react-router-dom'
import { AddRounded, DeleteRounded, RefreshRounded } from '@mui/icons-material'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'
import { AutoTable } from '../../../components/UI/AutoTable/AutoTable.tsx'

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
                <AutoTable
                    data={food as never[]}
                    onEdit={(row) => {
                        navigate(`edit/${(row as IDish).id}`)
                    }}
                    selected={selectedFood as never[]}
                    onSelected={(rows) => {
                        setSelectedFood(rows as IDish[])
                    }}
                    rowKey={'id'}
                    columns={[
                        { name: 'Название', key: 'name' },
                        { name: 'Цена', key: 'price' },
                        { name: 'Описание', key: 'description' },
                    ]}
                />
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
