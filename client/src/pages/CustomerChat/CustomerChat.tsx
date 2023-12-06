import { useAppSelector } from '../../hooks.ts'

export const CustomerChat = () => {
    const waiter = useAppSelector((state) => state.waiter)
    return (
        <section>
            <header>
                <h1>{waiter.name}</h1>
            </header>
            <div>
                <h2>Чат с официантом</h2>
                <p>В этом разделе вы можете написать официанту</p>
            </div>
        </section>
    )
}
