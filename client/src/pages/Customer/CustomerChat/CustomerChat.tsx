import { useAppSelector } from '../../../hooks/hooks.ts'
import { useState } from 'react'

enum Sender {
    CUSTOMER,
    WAITER,
}

interface IMessage {
    text: string
    sender: Sender
    time: string
}

export const CustomerChat = () => {
    const waiter = useAppSelector((state) => state.waiter)
    const [messages, setMessages] = useState<IMessage[]>([])
    const [message, setMessage] = useState('')
    const sendMessage = () => {
        //TODO: Placeholder
        const newMessage = {
            text: message,
            sender: Sender.CUSTOMER,
            time: new Date().toISOString(),
        }
        setMessages([...messages, newMessage])
        setMessage('')
    }
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
                <button onClick={() => sendMessage()}>Отправить</button>
            </form>
        </section>
    )
}
