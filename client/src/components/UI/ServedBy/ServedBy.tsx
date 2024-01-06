import { AccountCircle } from '@mui/icons-material'
import { useAppSelector } from '../../../hooks/hooks.ts'

export const ServedBy = () => {
    const waiter = useAppSelector((state) => state.waiter)
    return (
        waiter && (
            <section className={'flex gap-5'}>
                {waiter.image ? (
                    <img
                        src={waiter.image}
                        alt={waiter.name}
                        className={'h-12 w-12 rounded-full'}
                    />
                ) : (
                    <AccountCircle
                        fontSize={'inherit'}
                        style={{ fontSize: 48 }}
                    />
                )}
                <div>
                    Вас обслуживает:
                    <br />
                    <b>{waiter.name}</b>
                </div>
            </section>
        )
    )
}
