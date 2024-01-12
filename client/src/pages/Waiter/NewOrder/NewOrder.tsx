import { PageTitle } from '../../../components/UI/PageTitle/PageTitle.tsx'
import { ITable, TableStatus } from '../../../types/ITable.ts'
import { getOrderEntryTotal, IDish } from '../../../types/IDish.ts'
import { useEffect, useState } from 'react'
import TextField from '../../../components/UI/Input/TextField/TextField.tsx'
import Dropdown from '../../../components/UI/Input/Dropdown/Dropdown.tsx'
import styles from './NewOrder.module.css'
import { DeleteRounded, EditRounded } from '@mui/icons-material'
import DishModal from '../../../components/UI/Modal/DishModal.tsx'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts'
import { clearCart, removeFromCart } from '../../../features/cart/cartSlice.ts'
import { getAppliedDishExtras } from '../../../helpers.ts'
import { Button } from '../../../components/UI/Button/Button.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import { useNavigate } from 'react-router-dom'
import { getTables } from '../../../api/api.ts'

export const NewOrder = () => {
    const session = useAppSelector((state) => state.session)
    const [tables, setTables] = useState<ITable[]>([])
    useEffect(() => {
        getTables(session.token!, session.restaurantId!).then((tables) =>
            setTables(tables),
        )
    }, [session.restaurantId, session.token])
    const cart = useAppSelector((state) => state.cart.items)
    const [table, setTable] = useState('') //TODO: replace with ITable
    const [clientName, setClientName] = useState('')
    const dispatch = useAppDispatch()
    const [selectedDish, setSelectedDish] = useState<IDish | null>(null)
    const [confirmModalOpen, setConfirmModalOpen] = useState(false)
    const navigate = useNavigate()
    const createOrder = () => {
        //TODO: create order
        setTable('')
        setClientName('')
        setConfirmModalOpen(false)
        dispatch(clearCart())
        navigate('/employee/home')
        return true
    }
    return (
        <section className={'flex flex-col gap-3 px-3 pb-3'}>
            <Modal
                open={confirmModalOpen}
                title={'Подтвердите создание заказа'}>
                <p>
                    {clientName.length > 0 && clientName + ', '}
                    {table}
                </p>
                <h2>Состав заказа</h2>
                <ol className={'h-full list-decimal pl-5'}>
                    {cart.map((dish) => (
                        <li key={dish.id}>
                            {dish.food.name}, {dish.count} шт.,{' '}
                            {getOrderEntryTotal(dish)}₽
                        </li>
                    ))}
                </ol>
                <h2>
                    Итого: {cart.reduce((a, b) => a + getOrderEntryTotal(b), 0)}
                    ₽
                </h2>
                <Button label={'Подтвердить'} onClick={createOrder} dark />
                <Button
                    label={'Назад'}
                    onClick={() => setConfirmModalOpen(false)}
                    border></Button>
            </Modal>
            <DishModal
                isInCart
                item={selectedDish}
                onClose={() => setSelectedDish(null)}
            />
            <PageTitle title={'Новый заказ'} />
            <form className={'flex flex-col gap-3'}>
                <div className={'grid max-w-sm grid-cols-2 gap-y-3'}>
                    <label className={'contents'}>
                        <span className={'my-auto'}>Имя клиента</span>
                        <TextField
                            dark
                            onChange={(e) => setClientName(e.target.value)}
                        />
                    </label>
                    <label className={'contents'}>
                        <span className={'my-auto'}>Стол</span>
                        <Dropdown
                            required={true}
                            placeholder={' '}
                            options={tables
                                .filter((t) => t.status === TableStatus.OPEN)
                                .map((t) => t.name)}
                            dark
                            onChange={(e) => setTable(e.target.value)}
                        />
                    </label>
                </div>

                <div className={styles.orderTable}>
                    <div className={styles.orderTableHeader}>
                        <div>#</div>
                        <div>Название</div>
                        <div>Цена</div>
                    </div>
                    {cart.map((dish, index) => (
                        <details key={dish.id} className={styles.orderItem}>
                            <summary>
                                <div>{index + 1}</div>
                                <div className={'cursor-pointer font-medium'}>
                                    {`${dish.food.name}, ${dish.count} шт.`}
                                </div>
                                <div>{getOrderEntryTotal(dish)}₽</div>
                            </summary>
                            <div className={styles.expand}>
                                <div className={'col-span-1 col-start-2 py-2'}>
                                    {getAppliedDishExtras(dish.food).length >
                                        0 &&
                                        'Добавки: ' +
                                            getAppliedDishExtras(dish.food)}
                                </div>
                                <div className={'col-span-1 col-start-3 p-0'}>
                                    <button
                                        onClick={() =>
                                            setSelectedDish(dish.food)
                                        }>
                                        <EditRounded fontSize={'medium'} />
                                    </button>
                                    <button
                                        onClick={() =>
                                            dish.id &&
                                            dispatch(removeFromCart(dish.id))
                                        }>
                                        <DeleteRounded fontSize={'medium'} />
                                    </button>
                                </div>
                            </div>
                        </details>
                    ))}
                    <details className={styles.orderItem}>
                        <summary>
                            <div></div>
                            <div className={'font-bold'}>Итого:</div>
                            <div className={'font-bold'}>
                                {cart.reduce(
                                    (a, b) => a + getOrderEntryTotal(b),
                                    0,
                                )}
                                ₽
                            </div>
                        </summary>
                    </details>
                </div>
                <Button
                    label={'Создать заказ'}
                    onClick={() => setConfirmModalOpen(true)}
                    dark
                    disabled={cart.length == 0 || table.length == 0}
                />
                <Button
                    label={'Отчистить корзину'}
                    border
                    onClick={() => dispatch(clearCart())}
                    disabled={cart.length == 0}
                />
            </form>
        </section>
    )
}
