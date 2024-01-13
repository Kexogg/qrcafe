import { ArrowBackRounded, Block } from '@mui/icons-material'
import Modal from './Modal.tsx'
import {
    getOrderEntryTotal,
    IDish,
    toggleDishExtra,
} from '../../../types/IDish.ts'
import { useEffect, useState } from 'react'
import { Button } from '../Button/Button.tsx'
import { addToCart, updateCartItem } from '../../../features/cart/cartSlice.ts'
import { useAppDispatch } from '../../../hooks/hooks.ts'
import { CountInput } from '../CountInput/CountInput.tsx'
import { FoodStatus, IOrderEntry } from '../../../types/IOrderEntry.ts'

type DishModalProps = {
    item: IOrderEntry | IDish | null
    onClose: () => void
    isInCart?: boolean
}

const DishModal = ({ item, onClose, isInCart }: DishModalProps) => {
    const [currentItem, setCurrentItem] = useState<IOrderEntry | null>(null)
    useEffect(() => {
        if (item) {
            if ('food' in item) setCurrentItem(item as IOrderEntry)
            else
                setCurrentItem({
                    food: item,
                    count: 1,
                    createdAt: '',
                    id: '',
                    state: FoodStatus.NONE,
                })
        }
    }, [item])
    const dispatch = useAppDispatch()
    return (
        <Modal open={!!item} onClose={onClose}>
            {currentItem && (
                <div className={'flex h-full flex-col gap-3'}>
                    <div className={'relative flex aspect-[3/2] shrink-0'}>
                        <img
                            src={currentItem.food.imageUrl}
                            alt={currentItem.food.name}
                            className={
                                'absolute aspect-[3/2] w-full rounded-3xl object-cover'
                            }
                        />

                        <button
                            className={
                                'relative m-3 h-fit rounded-full bg-white/25 p-3 text-white backdrop-blur'
                            }
                            onClick={onClose}>
                            <ArrowBackRounded fontSize={'large'} />
                        </button>
                    </div>
                    <section className={'min-h-0 grow overflow-y-scroll'}>
                        <h1 className={'text-3xl font-bold text-primary-700'}>
                            {currentItem.food.name}
                        </h1>
                        <p className={'text-lg text-primary-700'}>
                            {currentItem.food.weight}
                        </p>
                        <p className={'text-lg text-primary-500'}>
                            {currentItem.food.description}
                        </p>
                        {!currentItem.food.available && (
                            <div
                                className={
                                    'flex items-center justify-center gap-3 pt-3 text-xl font-bold text-accent-800'
                                }>
                                <Block />В стоп-листе
                            </div>
                        )}
                    </section>
                    {currentItem.food.available && (
                        <section
                            className={
                                'mt-auto flex grow-0 flex-col justify-end gap-3'
                            }>
                            {currentItem.food.extras.length > 0 && (
                                <>
                                    <h2
                                        className={
                                            'text-xl font-medium text-primary-700'
                                        }>
                                        Добавить
                                    </h2>
                                    <ul
                                        className={
                                            'no-scrollbar flex grow-0 gap-3 overflow-y-scroll pb-1'
                                        }>
                                        {currentItem.food.extras.map(
                                            (extra) => {
                                                return (
                                                    <li key={extra.id}>
                                                        <button
                                                            className={`whitespace-nowrap rounded-3xl border-2 border-primary-700 p-2 ${
                                                                extra.applied
                                                                    ? 'bg-primary-700 text-white'
                                                                    : 'text-primary-700'
                                                            }`}
                                                            onClick={() => {
                                                                setCurrentItem({
                                                                    ...currentItem,
                                                                    food: {
                                                                        ...currentItem.food,
                                                                        extras: toggleDishExtra(
                                                                            currentItem.food,
                                                                            extra.id,
                                                                        ),
                                                                    },
                                                                })
                                                            }}>
                                                            {extra.name}
                                                            <br />+{extra.price}
                                                            ₽
                                                        </button>
                                                    </li>
                                                )
                                            },
                                        )}
                                    </ul>
                                </>
                            )}
                            <div className={'flex items-center'}>
                                <CountInput
                                    onCountChange={(count) =>
                                        setCurrentItem({
                                            ...currentItem,
                                            count: count,
                                        })
                                    }
                                    count={currentItem.count}
                                />
                                <div
                                    className={
                                        'ml-auto flex items-center gap-3'
                                    }>
                                    <span
                                        className={
                                            'text-xl font-bold text-primary-700 max-[350px]:hidden'
                                        }>
                                        Итого:
                                    </span>
                                    <p
                                        className={
                                            'rounded-full bg-primary-700 p-3 text-lg font-semibold text-white'
                                        }>
                                        {getOrderEntryTotal(currentItem)}₽
                                    </p>
                                </div>
                            </div>
                            <Button
                                label={
                                    isInCart
                                        ? 'Подтвердить изменения'
                                        : 'Добавить в заказ'
                                }
                                dark
                                onClick={() => {
                                    if (isInCart)
                                        dispatch(updateCartItem(currentItem))
                                    else dispatch(addToCart(currentItem))
                                    onClose()
                                }}
                            />
                        </section>
                    )}
                </div>
            )}
        </Modal>
    )
}

export default DishModal
