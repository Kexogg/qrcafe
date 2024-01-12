import { useAppSelector } from '../../../hooks/hooks.ts'
import { IRestaurant } from '../../../types/IRestaurant.ts'
import { useEffect, useState } from 'react'
import { getEmployees, getRestaurant, getTables } from '../../../api/api.ts'
import { DashboardHomeCard } from './DashboardHomeCard.tsx'
import { IEmployee } from '../../../types/IEmployee.ts'
import { ITable } from '../../../types/ITable.ts'
import { Link } from 'react-router-dom'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'

export const DashboardHome = () => {
    const session = useAppSelector((state) => state.session)
    const [restaurant, setRestaurant] = useState<IRestaurant | null>(null)
    const [employees, setEmployees] = useState<IEmployee[] | null>(null)
    const [tables, setTables] = useState<ITable[] | null>(null)
    useEffect(() => {
        getRestaurant(session.token!, session.restaurantId!).then((r) => {
            setRestaurant(r)
        })
        getEmployees(session.token!, session.restaurantId!).then((r) => {
            setEmployees(r)
        })
        getTables(session.token!, session.restaurantId!).then((r) => {
            setTables(r.filter((t) => t.client !== null))
        })
    }, [session.restaurantId, session.token])
    if (!restaurant || !employees || !tables) return <LoadingSpinner />
    return (
        <section>
            <h1>{restaurant?.name}</h1>
            <h3>Адрес: {restaurant?.address}</h3>
            <div className={'grid grid-cols-2 gap-3 lg:grid-cols-3'}>
                <Link to={'../employees'}>
                    <DashboardHomeCard
                        title={'Сотрудников на смене'}
                        value={employees
                            .filter((e) => e.available)
                            .length.toString()}
                    />
                </Link>
                <Link to={'../tables'}>
                    <DashboardHomeCard
                        title={'Столиков занято'}
                        value={tables.length.toString()}
                    />
                </Link>
                <Link to={'../orders'}>
                    <DashboardHomeCard
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
