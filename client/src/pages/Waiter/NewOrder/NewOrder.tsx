import { PageTitle } from '../../../components/UI/PageTitle/PageTitle.tsx'
import {
    getPlaceholderTables,
    ITable,
    TableStatus,
} from '../../../types/ITable.ts'
import { getDishTotal, IDish } from '../../../types/IDish.ts'
import { useState } from 'react'
import TextField from '../../../components/UI/TextField/TextField.tsx'
import Dropdown from '../../../components/UI/Dropdown/Dropdown.tsx'
import styles from './NewOrder.module.css'
import { DeleteRounded, EditRounded } from '@mui/icons-material'
import DishModal from '../../../components/UI/Modal/DishModal.tsx'
import { useAppDispatch, useAppSelector } from '../../../hooks.ts'
import { clearCart, removeFromCart } from '../../../features/cart/cartSlice.ts'
import { getAppliedDishExtras } from '../../../helpers.ts'
import { Button } from '../../../components/UI/Button/Button.tsx'

export const NewOrder = () => {
    const tables: ITable[] = getPlaceholderTables()
    const cart = useAppSelector((state) => state.cart.items)
    const dispatch = useAppDispatch()
    const [selectedDish, setSelectedDish] = useState<IDish | null>(null)
    return (
        <section className={'flex flex-col gap-3 px-3 pb-3'}>
            <DishModal
                isInCart
                dish={selectedDish}
                onClose={() => setSelectedDish(null)}
            />
            <PageTitle title={'Новый заказ'} />
            <form className={'flex flex-col gap-3'}>
                <div className={'grid max-w-sm grid-cols-2 gap-y-3'}>
                    <label className={'contents'}>
                        <span className={'my-auto'}>Имя клиента</span>
                        <TextField dark />
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
                        <details key={dish.cartId} className={styles.orderItem}>
                            <summary>
                                <div>{index + 1}</div>
                                <div className={'cursor-pointer font-medium'}>
                                    {`${dish.name}, ${dish.count} шт.`}
                                </div>
                                <div>{getDishTotal(dish)}₽</div>
                            </summary>
                            <div className={styles.expand}>
                                <div className={'col-span-1 col-start-2 py-2'}>
                                    {getAppliedDishExtras(dish).length > 0 &&
                                        'Добавки: ' +
                                            getAppliedDishExtras(dish)}
                                </div>
                                <div className={'col-span-1 col-start-3 p-0'}>
                                    <button
                                        onClick={() => setSelectedDish(dish)}>
                                        <EditRounded fontSize={'medium'} />
                                    </button>
                                    <button
                                        onClick={() =>
                                            dish.cartId &&
                                            dispatch(
                                                removeFromCart(dish.cartId),
                                            )
                                        }>
                                        <DeleteRounded fontSize={'medium'} />
                                    </button>
                                </div>
                            </div>
                        </details>
                    ))}
                </div>
                <Button
                    label={'Создать заказ'}
                    dark
                    disabled={cart.length == 0}
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
