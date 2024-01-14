import { useAppSelector } from '../../../hooks/hooks.ts'
import { useState } from 'react'
import useChat from '../../../hooks/useChat.ts'

export const CustomerChat = () => {
    const waiter = useAppSelector((state) => state.waiter)
    const session = useAppSelector((state) => state.session)
    const [message, setMessage] = useState('')

    /*const connection = new signalR.HubConnectionBuilder()
        .withUrl('/api/chat', {
            accessTokenFactory: () => session.token!,
        })
        .build()

    connection.on('send', (data) => {
        console.log(data)
    })
    connection.start().then(() => connection.invoke('send', 'Hello'))*/
    const { messages, sendMessage } = useChat('/api/chat', session.token!)
    return (
        <section className={'px-3'}>
            <header>
                <h1>{waiter.name}</h1>
            </header>
            <div>
                <h2>Чат с официантом</h2>
                <p>В этом разделе вы можете написать официанту</p>
            </div>
            {messages.map((message) => (
                <div key={message.time}>
                    <span>
                        {message.sender} {message.time}
                    </span>
                    <p>{message.text}</p>
                </div>
            ))}
            <form onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={() => sendMessage(message)}>Отправить</button>
            </form>
        </section>
    )
}
