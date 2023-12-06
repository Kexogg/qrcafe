import { ArrowBackRounded } from '@mui/icons-material'
import { getDishTotal, IDish } from '../../types/IDish.ts'
import { useAppDispatch, useAppSelector } from '../../hooks.ts'
import { clearCart } from '../../features/cart/cartSlice.ts'
import { useState } from 'react'
import DishModal from '../../components/UI/Modal/DishModal.tsx'
import { DishCardCart } from '../../components/UI/DishCartdCart/DishCardCart.tsx'
import { Button } from '../../components/UI/Button/Button.tsx'
import Modal from '../../components/UI/Modal/Modal.tsx'

export const CustomerCart = () => {
    const cart = useAppSelector((state) => state.cart.items)
    const [selectedDish, setSelectedDish] = useState<IDish | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const dispatch = useAppDispatch()
    const totalCost = cart.reduce((acc, dish) => acc + getDishTotal(dish), 0)
    return (
        <>
            <Modal
                autoHeight
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={'Вы уверены?'}>
                <p>Подтвердив заказ, вы сможете только добавлять блюда</p>
                <p>Сумма заказа - {totalCost}₽</p>
                <Button label={'Подтвердить'} dark onClick={() => null} />
                <Button label={'Назад'} onClick={() => setIsModalOpen(false)} />
            </Modal>
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
            <div
                className={
                    'flex max-w-lg flex-wrap items-center justify-between px-3 py-6'
                }>
                <h2 className={'text-primary-700'}>Всего: {totalCost}₽</h2>
                <Button
                    label={'Оформить заказ'}
                    dark
                    onClick={() => setIsModalOpen(true)}
                />
            </div>
        </>
    )
}
