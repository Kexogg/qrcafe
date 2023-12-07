import { useAppDispatch, useAppSelector } from '../../hooks.ts'
import { useState } from 'react'
import { Tips } from '../../components/UI/Tips/Tips.tsx'
import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material'
import { Button } from '../../components/UI/Button/Button.tsx'
import { updatePaid } from '../../features/cart/cartSlice.ts'
import { PageTitle } from '../../components/UI/PageTitle/PageTitle.tsx'
import { getDishTotal } from '../../types/IDish.ts'

export const CustomerPayment = () => {
    const dispatch = useAppDispatch()
    const total = useAppSelector((state) =>
        state.cart.items.reduce((acc, dish) => acc + getDishTotal(dish), 0),
    )
    const [tip, setTip] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState('')
    const paymentMethods: string[] = [
        'Наличные',
        'Карта (в приложении)',
        'Карта (терминал)',
        'Система быстрых платежей',
    ]
    return (
        <section className={'flex flex-col gap-3 px-3 text-primary-700'}>
            <PageTitle title={'Оплата счёта'} />
            <h2>Выберите способ оплаты</h2>
            <form className={'flex w-fit flex-col gap-3'}>
                {paymentMethods.map((method) => {
                    return (
                        <label
                            key={method}
                            className={
                                'flex cursor-pointer items-center gap-3'
                            }>
                            {paymentMethod === method ? (
                                <RadioButtonChecked />
                            ) : (
                                <RadioButtonUnchecked />
                            )}
                            <input
                                className={'appearance-none'}
                                type={'radio'}
                                name={'paymentMethod'}
                                value={method}
                                onClick={() => setPaymentMethod(method)}
                            />
                            {method}
                        </label>
                    )
                })}
            </form>
            <Tips onTipChange={setTip} />
            <h2>
                Сумма счёта: {tip > 0 && `${total} + ${tip} =`} {total + tip}₽
            </h2>
            <span className={'flex w-full max-w-lg flex-col'}>
                <Button
                    label={'Оплатить'}
                    dark
                    disabled={!paymentMethod}
                    onClick={() => dispatch(updatePaid(true))}
                />
            </span>
        </section>
    )
}
