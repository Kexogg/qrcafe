import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts'
import { setWaiter } from '../../../features/waiter/waiterSlice.ts'
import { AccountCircle } from '@mui/icons-material'
import { Button } from '../../../components/UI/Button/Button.tsx'
import { useNavigate } from 'react-router-dom'
import { setSession } from '../../../features/session/sessionSlice.ts'

export const LoginWelcome = () => {
    const waiter = useAppSelector((state) => state.waiter)
    const name = useAppSelector((state) => state.customer.name)
    const session = useAppSelector((state) => state.session)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    if (!waiter.id) {
        dispatch(setWaiter({ name: 'Иван', id: '2134', image: undefined }))
        return <></>
    } else {
        return (
            <>
                <h1 className={'my-3 text-3xl'}>
                    {name ? (
                        <>
                            Добро пожаловать, <br />
                            {name}!
                        </>
                    ) : (
                        <>Добро пожаловать!</>
                    )}
                </h1>
                <section
                    className={'flex flex-col items-center justify-center'}>
                    <b className={'text-lg'}>Вас обслуживает</b>
                    {waiter.image ? (
                        <img
                            src={waiter.image}
                            alt={waiter.name}
                            className={
                                'mx-auto my-5 aspect-square h-40 w-auto rounded-full object-cover'
                            }
                        />
                    ) : (
                        <AccountCircle
                            fontSize={'inherit'}
                            style={{ fontSize: 120 }}
                            className={'mx-auto my-5'}
                        />
                    )}
                    <p className={'col-span-1 text-2xl'}>{waiter.name}</p>
                </section>
                <div className={'mt-auto flex flex-col'}>
                    <Button
                        label={'Продолжить'}
                        onClick={() => {
                            dispatch(setSession({ ...session, type: 1 }))
                            navigate('/customer/home')
                        }}
                    />
                </div>
            </>
        )
    }
}
