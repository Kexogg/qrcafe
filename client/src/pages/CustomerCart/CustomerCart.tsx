import { getDishTotal, IDish } from '../../types/IDish.ts'
import { useAppDispatch, useAppSelector } from '../../hooks.ts'
import { clearCart, updateConfirmed } from '../../features/cart/cartSlice.ts'
import { useState } from 'react'
import DishModal from '../../components/UI/Modal/DishModal.tsx'
import { DishCardCart } from '../../components/UI/DishCartdCart/DishCardCart.tsx'
import { Button } from '../../components/UI/Button/Button.tsx'
import Modal from '../../components/UI/Modal/Modal.tsx'
import { PageTitle } from '../../components/UI/PageTitle/PageTitle.tsx'
import { useNavigate } from 'react-router-dom'

export const CustomerCart = () => {
    const cart = useAppSelector((state) => state.cart.items)
    const navigate = useNavigate()
    const isOrderConfirmed = useAppSelector((state) => state.cart.confirmed)
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
                <Button
                    label={'Подтвердить'}
                    dark
                    onClick={() => {
                        dispatch(updateConfirmed(true))
                        setIsModalOpen(false)
                    }}
                />
                <Button label={'Назад'} onClick={() => setIsModalOpen(false)} />
            </Modal>
            <DishModal
                isInCart
                dish={selectedDish}
                onClose={() => setSelectedDish(null)}
            />
            <section className={'container mx-auto px-3'}>
                <PageTitle title={'Ваш заказ'} />
                {isOrderConfirmed ? (
                    <div className={'pb-6 text-primary-700'}>
                        <h2>Ваш заказ подтвержден и передан на кухню</h2>
                        <p>Вы можете добавлять другие блюда в заказ</p>
                    </div>
                ) : (
                    <button
                        className={'text-primary-700'}
                        onClick={() => dispatch(clearCart())}>
                        Удалить всё
                    </button>
                )}
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
                {!isOrderConfirmed ? (
                    <Button
                        label={'Оформить заказ'}
                        dark
                        disabled={cart.length === 0}
                        onClick={() => setIsModalOpen(true)}
                    />
                ) : (
                    <Button
                        label={'Запросить счёт'}
                        dark
                        onClick={() => navigate('/customer/payment')}
                    />
                )}
            </div>
        </>
    )
}
