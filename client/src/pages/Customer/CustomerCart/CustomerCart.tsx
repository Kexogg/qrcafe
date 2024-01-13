import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts'
import { clearCart, updateConfirmed } from '../../../features/cart/cartSlice.ts'
import { useEffect, useState } from 'react'
import DishModal from '../../../components/UI/Modal/DishModal.tsx'
import { DishCardCart } from '../../../components/UI/DishCartdCart/DishCardCart.tsx'
import { Button } from '../../../components/UI/Button/Button.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import { PageTitle } from '../../../components/UI/PageTitle/PageTitle.tsx'
import { Link, useNavigate } from 'react-router-dom'
import { getCartTotal, getFilteredCart } from '../../../helpers.ts'
import { ErrorBox } from '../../../components/UI/ErrorBox/ErrorBox.tsx'
import { FoodStatus, IOrderEntry } from '../../../types/IOrderEntry.ts'
import { createOrder, getOrder } from '../../../api/api.ts'

type CustomerCartCards = {
    setSelectedDish: (dish: IOrderEntry) => void
    cards: IOrderEntry[]
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
                    key={item.id}
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
    const [order, setOrder] = useState<IOrderEntry[]>([])
    const session = useAppSelector((state) => state.session)
    useEffect(() => {
        getOrder(session.token!, session.restaurantId!).then((r) => {
            setOrder(r)
        })
    }, [session.restaurantId, session.token])

    const isOrderConfirmed = useAppSelector((state) => state.cart.confirmed)
    const [selectedDish, setSelectedDish] = useState<IOrderEntry | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [error, setError] = useState('')
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
                    {getCartTotal(getFilteredCart(cart, FoodStatus.NEW))}₽
                </p>
                <Button
                    label={'Подтвердить'}
                    dark
                    onClick={() => {
                        createOrder(session.token!, session.restaurantId!, cart)
                            .then((r) => {
                                console.log(r)
                                dispatch(updateConfirmed(true))
                                dispatch(clearCart())
                                getOrder(
                                    session.token!,
                                    session.restaurantId!,
                                ).then((r) => {
                                    setOrder(r)
                                })
                            })
                            .catch((err) => {
                                setError(err)
                            })
                            .finally(() => setIsModalOpen(false))
                        setIsModalOpen(false)
                    }}
                />
                <Button label={'Назад'} onClick={() => setIsModalOpen(false)} />
            </Modal>
            <DishModal
                isInCart
                item={selectedDish}
                onClose={() => setSelectedDish(null)}
            />
            <PageTitle title={'Ваш заказ'} />
            {error && <ErrorBox error={error} />}
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
            {getFilteredCart(cart, FoodStatus.NEW).length > 0 && (
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
                        cards={getFilteredCart(cart, FoodStatus.NEW)}
                        dispatch={dispatch}
                    />
                    <div
                        className={
                            'flex max-w-lg flex-wrap items-center justify-between'
                        }>
                        <h2>
                            {`Итого: ${getCartTotal(
                                getFilteredCart(cart, FoodStatus.NEW),
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
                        cards={getFilteredCart(order, FoodStatus.COOKING)}
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
                    <h2>Всего: {getCartTotal(order)}₽</h2>
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
