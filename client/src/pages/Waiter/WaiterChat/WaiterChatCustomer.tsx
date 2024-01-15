import { useAppSelector } from '../../../hooks/hooks.ts'
import { useEffect, useState } from 'react'
import useChat from '../../../hooks/useChat.ts'
import { ArrowBackRounded, SendRounded } from '@mui/icons-material'
import { IClient } from '../../../types/IClient.ts'
import { getClientById } from '../../../api/api.ts'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'
import { useNavigate, useParams } from 'react-router-dom'

export const WaiterChatCustomer = () => {
    const session = useAppSelector((state) => state.session)
    const params = useParams()
    const [message, setMessage] = useState('')
    const { messages, sendMessage } = useChat(
        '/api/chat',
        session.token!,
        params.id,
    )
    const [client, setClient] = useState<IClient | null>(null)
    useEffect(() => {
        getClientById(session.token!, session.restaurantId!, params.id!).then(
            (c) => {
                setClient(c)
            },
        )
    }, [params.id, session.restaurantId, session.token])
    const navigate = useNavigate()
    if (!client) return <LoadingSpinner />
    return (
        <section className={'flex grow flex-col px-3'}>
            <div className={'h-18 mb-3 flex gap-3'}>
                <button
                    className={
                        'h-18 block aspect-square rounded-full bg-accent-800 text-white'
                    }
                    onClick={() => navigate(-1)}>
                    <ArrowBackRounded />
                </button>
                <header
                    className={
                        'h-18 grow rounded-3xl bg-primary-700 px-4 py-1 text-white'
                    }>
                    <h1>{client.name ?? 'Клиент ' + client.tableId}</h1>
                </header>
            </div>
            <div className={'flex h-auto grow flex-col text-center'}>
                <h2>Чат с клиентом</h2>
                {messages.map((message) => (
                    <div key={message.time}>
                        <span>
                            {message.sender} {message.time}
                        </span>
                        <p>{message.text}</p>
                    </div>
                ))}
            </div>
            <form
                className={'flex gap-3 py-3'}
                onSubmit={(e) => e.preventDefault()}>
                <input
                    className={'grow rounded-full p-3'}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    className={
                        'h-12 w-12 shrink-0 rounded-full bg-primary-700 text-white'
                    }
                    onClick={() => sendMessage(message)}>
                    <SendRounded />
                </button>
            </form>
        </section>
    )
}
