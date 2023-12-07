import { ArrowBackRounded } from '@mui/icons-material'
import Modal from './Modal.tsx'
import { getDishTotal, IDish, toggleDishExtra } from '../../../types/IDish.ts'
import { useEffect, useState } from 'react'
import { Button } from '../Button/Button.tsx'
import { addToCart, updateCartItem } from '../../../features/cart/cartSlice.ts'
import { useAppDispatch } from '../../../hooks.ts'
import { CountInput } from '../CountInput/CountInput.tsx'

type DishModalProps = {
    dish: IDish | null
    onClose: () => void
    isInCart?: boolean
}

const DishModal = ({ dish, onClose, isInCart }: DishModalProps) => {
    const [currentDish, setCurrentDish] = useState<IDish | null>(null)
    useEffect(() => {
        setCurrentDish(
            dish ? { ...structuredClone(dish), count: dish.count ?? 1 } : null,
        )
    }, [dish])
    const dispatch = useAppDispatch()
    return (
        <Modal open={!!dish} onClose={onClose}>
            {currentDish && (
                <div className={'flex h-full flex-col gap-3'}>
                    <div className={'relative flex aspect-[3/2] shrink-0'}>
                        <img
                            src={currentDish.image}
                            alt={currentDish.name}
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
                            {currentDish.name}
                        </h1>
                        <p className={'text-lg text-primary-700'}>
                            {currentDish.weight}
                        </p>
                        <p className={'text-lg text-primary-500'}>
                            {currentDish.description}
                        </p>
                    </section>
                    <section
                        className={
                            'mt-auto flex grow-0 flex-col justify-end gap-3'
                        }>
                        {currentDish.extras.length > 0 && (
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
                                    {currentDish.extras.map((extra) => {
                                        return (
                                            <li key={extra.id}>
                                                <button
                                                    className={`whitespace-nowrap rounded-3xl border-2 border-primary-700 p-2 ${
                                                        extra.applied
                                                            ? 'bg-primary-700 text-white'
                                                            : 'text-primary-700'
                                                    }`}
                                                    onClick={() => {
                                                        setCurrentDish({
                                                            ...currentDish,
                                                            extras: toggleDishExtra(
                                                                currentDish,
                                                                extra.id,
                                                            ),
                                                        })
                                                    }}>
                                                    {extra.name}
                                                    <br />+{extra.price}₽
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </>
                        )}
                        <div className={'flex items-center'}>
                            <CountInput
                                onCountChange={(count) =>
                                    setCurrentDish({
                                        ...currentDish,
                                        count: count,
                                    })
                                }
                                count={currentDish.count ?? 1}
                            />
                            <div className={'ml-auto flex items-center gap-3'}>
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
                                    {getDishTotal(currentDish)}₽
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
                                    dispatch(updateCartItem(currentDish))
                                else dispatch(addToCart(currentDish))
                                onClose()
                            }}
                        />
                    </section>
                </div>
            )}
        </Modal>
    )
}

export default DishModal
