import { ArrowBackRounded } from '@mui/icons-material'
import { getDishTotal, IDish } from '../../types/IDish.ts'
import { useAppDispatch, useAppSelector } from '../../hooks.ts'
import { clearCart } from '../../features/cart/cartSlice.ts'
import { useState } from 'react'
import DishModal from '../../components/UI/Modal/DishModal.tsx'
import { DishCardCart } from '../../components/UI/DishCartdCart/DishCardCart.tsx'

export const CustomerCart = () => {
    const cart = useAppSelector((state) => state.cart.items)
    const [selectedDish, setSelectedDish] = useState<IDish | null>(null)
    const dispatch = useAppDispatch()
    const totalCost = cart.reduce((acc, dish) => acc + getDishTotal(dish), 0)
    return (
        <>
            <DishModal
                isInCart
                dish={selectedDish}
                onClose={() => setSelectedDish(null)}
            />
            <section className={'container mx-auto px-3'}>
                <div className={'flex items-center gap-5 pb-5 text-accent-800'}>
                    <ArrowBackRounded fontSize={'large'} />
                    <h1>Ваш заказ</h1>
                    <button
                        className={'ml-auto text-primary-700'}
                        onClick={() => dispatch(clearCart())}>
                        Удалить всё
                    </button>
                </div>
                <ul className={'flex flex-col gap-5'}>
                    {cart.map((item) => (
                        <DishCardCart
                            key={item.cartId}
                            item={item}
                            setSelectedDish={setSelectedDish}
                            dispatch={dispatch}
                        />
                    ))}
                </ul>
            </section>
            <button
                className={
                    'sticky bottom-16 left-0 mx-auto my-4 block w-full max-w-sm justify-center divide-x divide-solid rounded-full bg-primary-700 p-3 text-xl font-bold text-white shadow'
                }>
                <span className={'pr-2'}>Оформить заказ</span>
                <span className={'pl-2'}>{totalCost}₽</span>
            </button>
        </>
    )
}
