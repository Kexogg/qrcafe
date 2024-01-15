import { useAppSelector } from '../../../hooks/hooks.ts'
import { useState } from 'react'
import useChat from '../../../hooks/useChat.ts'
import { SendRounded } from '@mui/icons-material'

export const CustomerChat = () => {
    const waiter = useAppSelector((state) => state.waiter)
    const session = useAppSelector((state) => state.session)
    const [message, setMessage] = useState('')
    const { messages, sendMessage } = useChat('/api/chat', session.token!)

    return (
        <section className={'flex grow flex-col px-3'}>
            <header
                className={
                    'mb-3 flex items-center gap-3 rounded-3xl bg-primary-700 px-4 py-2 text-white'
                }>
                <img
                    src={waiter.image}
                    alt={waiter.name}
                    className={'size-10 rounded-full'}
                />
                <h1>{waiter.name}</h1>
            </header>
            <div className={'flex h-auto grow flex-col text-center'}>
                <h2>Чат с официантом</h2>
                <p>В этом разделе вы можете написать официанту</p>
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
