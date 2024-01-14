import { useAppSelector } from '../../../hooks/hooks.ts'
import { IRestaurant } from '../../../types/IRestaurant.ts'
import { useEffect, useState } from 'react'
import { getEmployees, getRestaurant, getTables } from '../../../api/api.ts'
import { DashboardHomeCard } from './DashboardHomeCard.tsx'
import { IEmployee } from '../../../types/IEmployee.ts'
import { ITable } from '../../../types/ITable.ts'
import { Link } from 'react-router-dom'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'
import {
    PeopleRounded,
    SoupKitchenRounded,
    TableRestaurantRounded,
} from '@mui/icons-material'
import { ErrorBox } from '../../../components/UI/ErrorBox/ErrorBox.tsx'
import { AxiosError } from 'axios'

export const DashboardHome = () => {
    const session = useAppSelector((state) => state.session)
    const [restaurant, setRestaurant] = useState<IRestaurant>({} as IRestaurant)
    const [employees, setEmployees] = useState<IEmployee[]>([])
    const [tables, setTables] = useState<ITable[]>([])
    const [error, setError] = useState<string | Error | AxiosError>('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // TODO: better error handling
        const fetch = async () => {
            getRestaurant(session.token!, session.restaurantId!)
                .then((r) => {
                    setRestaurant(r)
                })
                .catch((e) => setError(e))
            getEmployees(session.token!, session.restaurantId!)
                .then((r) => {
                    setEmployees(r)
                })
                .catch((e) => setError(e))
            getTables(session.token!, session.restaurantId!)
                .then((r) => {
                    setTables(r.filter((t) => t.client !== null))
                })
                .catch((e) => setError(e))
        }
        fetch().finally(() => setLoading(false))
    }, [session.restaurantId, session.token])
    if (loading) return <LoadingSpinner />
    return (
        <section>
            <h1>{restaurant?.name}</h1>
            <h3>Адрес: {restaurant?.address}</h3>
            {error && <ErrorBox error={error} />}
            <div className={'grid grid-cols-2 gap-3 lg:grid-cols-3'}>
                <Link to={'../employees'}>
                    <DashboardHomeCard
                        title={'Сотрудников на смене'}
                        icon={<PeopleRounded />}
                        value={employees
                            .filter((e) => e.available)
                            .length.toString()}
                    />
                </Link>
                <Link to={'../tables'}>
                    <DashboardHomeCard
                        icon={<TableRestaurantRounded />}
                        title={'Столиков занято'}
                        value={tables.length.toString()}
                    />
                </Link>
                <Link to={'../orders'}>
                    <DashboardHomeCard
                        icon={<SoupKitchenRounded />}
                        title={'Еды в готовке'}
                        value={tables
                            .map((t) => t.client?.order?.length ?? 0)
                            .reduce((a, b) => a + b, 0)
                            .toString()}
                    />
                </Link>
            </div>
        </section>
    )
}
