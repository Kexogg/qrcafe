import { PageTitle } from '../../../components/UI/PageTitle/PageTitle.tsx'
import * as signalR from '@microsoft/signalr'
import { useAppSelector } from '../../../hooks/hooks.ts'

export const WaiterChat = () => {
    const session = useAppSelector((state) => state.session)
    const connection = new signalR.HubConnectionBuilder()
        .withUrl('/api/chat', {
            accessTokenFactory: () => session.token!,
        })
        .build()

    connection.on('send', (data) => {
        console.log(data)
    })
    connection.start().then(() => connection.invoke('send', 'Hello'))
    return (
        <section>
            <PageTitle title={'Чат'} />
        </section>
    )
}
