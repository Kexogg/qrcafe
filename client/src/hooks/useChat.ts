import { useEffect, useState } from 'react'
import * as signalR from '@microsoft/signalr'

interface IMessage {
    text: string
    sender: string
    time: string
}

const useChat = (
    url: string,
    accessToken: string,
    clientId?: string | undefined,
) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(
        null,
    )
    const [messages, setMessages] = useState<IMessage[]>([])

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(url + (clientId ? `?clientId=${clientId}` : ''), {
                accessTokenFactory: () => accessToken,
            })
            .withAutomaticReconnect()
            .build()

        setConnection(newConnection)
    }, [url, accessToken, clientId])

    const sendMessage = async (message: string) => {
        if (connection) {
            try {
                await connection.invoke('Send', message)
            } catch (err) {
                console.error(err)
            }
        }
    }

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => console.log('Connection started'))
                .catch((err) => console.log(err))

            connection.on('ReceiveMessage', (message: IMessage) => {
                setMessages((messages) => [...messages, message])
            })
        }

        return () => {
            if (connection) {
                connection.stop()
            }
        }
    }, [connection])

    return { messages, sendMessage }
}

export default useChat
