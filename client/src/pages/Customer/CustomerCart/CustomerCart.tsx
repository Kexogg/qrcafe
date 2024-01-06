import { DishStatus, IDish } from '../../../types/IDish.ts'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts'
import {
    clearCart,
    updateCart,
    updateConfirmed,
} from '../../../features/cart/cartSlice.ts'
import { useState } from 'react'
import DishModal from '../../../components/UI/Modal/DishModal.tsx'
import { DishCardCart } from '../../../components/UI/DishCartdCart/DishCardCart.tsx'
import { Button } from '../../../components/UI/Button/Button.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import { PageTitle } from '../../../components/UI/PageTitle/PageTitle.tsx'
import { Link, useNavigate } from 'react-router-dom'
import { getCartTotal, getFilteredCart } from '../../../helpers.ts'

type CustomerCartCards = {
    setSelectedDish: (dish: IDish) => void
    cards: IDish[]
    dispatch: ReturnType<typeof useAppDispatch>
}

const CustomerCartCards = ({
    setSelectedDish,
    cards,
    dispatch,
}: CustomerCartCards) => {
    return (
        <ul className={'flex flex-col gap-5'}>
            {cards.map((item) => (
                <DishCardCart
                    key={item.cartId}
                    item={item}
                    setSelectedDish={setSelectedDish}
                    dispatch={dispatch}
                />
            ))}
        </ul>
    )
}

export const CustomerCart = () => {
    const cart = useAppSelector((state) => state.cart.items)
    const navigate = useNavigate()
    const isOrderConfirmed = useAppSelector((state) => state.cart.confirmed)
    const [selectedDish, setSelectedDish] = useState<IDish | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const dispatch = useAppDispatch()
    return (
        <section className={'container mx-auto px-3 text-primary-700'}>
            <Modal
                autoHeight
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={'Вы уверены?'}>
                <p>Подтвердив заказ, вы не сможете удалить эти блюда</p>
                <p>
                    Сумма заказа -{' '}
                    {getCartTotal(getFilteredCart(cart, DishStatus.NEW))}₽
                </p>
                <Button
                    label={'Подтвердить'}
                    dark
                    onClick={() => {
                        dispatch(updateConfirmed(true))
                        dispatch(
                            updateCart(
                                cart.map((dish) => ({
                                    ...dish,
                                    status: DishStatus.COOKING,
                                })),
                            ),
                        )
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
            <PageTitle title={'Ваш заказ'} />
            {isOrderConfirmed && (
                <div
                    className={
                        'my-5 max-w-lg rounded-3xl border-2 border-primary-700 p-5'
                    }>
                    <h2>Ваш заказ подтвержден и передан на кухню</h2>
                    <p>Вы можете добавлять другие блюда в заказ</p>
                </div>
            )}
            {cart.length === 0 && (
                <div className={'pt-5'}>
                    <h2>Корзина пуста</h2>
                    <p>
                        Перейдите на{' '}
                        <Link className={'underline'} to={'/customer/home'}>
                            главную
                        </Link>{' '}
                        и добавьте что-то в корзину
                    </p>
                </div>
            )}
            {getFilteredCart(cart, DishStatus.NEW).length > 0 && (
                <div className={'flex flex-col gap-3'}>
                    <div>
                        <h3>Новые блюда</h3>
                        <p>
                            Вы добавили эти блюда в корзину, но не заказали их
                        </p>
                    </div>
                    {!isOrderConfirmed && (
                        <button onClick={() => dispatch(clearCart())}>
                            Удалить всё
                        </button>
                    )}
                    <CustomerCartCards
                        setSelectedDish={setSelectedDish}
                        cards={getFilteredCart(cart, DishStatus.NEW)}
                        dispatch={dispatch}
                    />
                    <div
                        className={
                            'flex max-w-lg flex-wrap items-center justify-between'
                        }>
                        <h2>
                            {`Итого: ${getCartTotal(
                                getFilteredCart(cart, DishStatus.NEW),
                            )}₽`}
                        </h2>
                        <Button
                            label={'Добавить в заказ'}
                            dark
                            disabled={cart.length === 0}
                            onClick={() => setIsModalOpen(true)}
                        />
                    </div>
                    <hr />
                </div>
            )}
            <div className={'flex flex-col gap-5'}>
                {isOrderConfirmed && <h3>Готовится</h3>}
                {
                    <CustomerCartCards
                        setSelectedDish={setSelectedDish}
                        cards={getFilteredCart(cart, DishStatus.COOKING)}
                        dispatch={dispatch}
                    />
                }
            </div>
            {isOrderConfirmed && (
                <div
                    className={
                        'flex max-w-lg flex-wrap items-center justify-between gap-3 py-6'
                    }>
                    <p>
                        Запросите счёт для оплаты заказа. Запросив счёт, вы
                        больше не сможете ничего заказать.
                    </p>
                    <h2>Всего: {getCartTotal(cart)}₽</h2>
                    <Button
                        label={'Запросить счёт'}
                        dark
                        onClick={() => navigate('/customer/payment')}
                    />
                </div>
            )}
        </section>
    )
}
