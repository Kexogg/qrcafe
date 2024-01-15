import { PageTitle } from '../../../components/UI/PageTitle/PageTitle.tsx'
import { useAppSelector } from '../../../hooks/hooks.ts'
import { IClient } from '../../../types/IClient.ts'
import { useEffect, useState } from 'react'
import { getClients, getEmployeeInfo } from '../../../api/api.ts'
import { Link } from 'react-router-dom'

export const WaiterChat = () => {
    const session = useAppSelector((state) => state.session)
    const [clients, setClients] = useState<IClient[]>([])
    useEffect(() => {
        getEmployeeInfo(session.token!, session.restaurantId!).then((e) => {
            getClients(session.token!, session.restaurantId!).then((c) => {
                setClients(
                    c.filter((client) => client.assignedEmployeeId === e.id),
                )
            })
        })
    }, [session.restaurantId, session.token])
    return (
        <section>
            <PageTitle title={'Чат'} />
            <ul className={'flex flex-col'}>
                {clients.map((client) => (
                    <li key={client.id}>
                        <Link
                            className={
                                'block w-full rounded-3xl bg-primary-50 p-3 hover:bg-primary-50/50'
                            }
                            to={client.id}>
                            <h2>{client.name ?? 'Клиент ' + client.tableId}</h2>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}
