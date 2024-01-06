import { DeleteRounded, EditRounded } from '@mui/icons-material'
import { CountInput } from '../CountInput/CountInput.tsx'
import {
    removeFromCart,
    updateCartItem,
} from '../../../features/cart/cartSlice.ts'
import { DishStatus, getDishTotal, IDish } from '../../../types/IDish.ts'
import { useAppDispatch } from '../../../hooks/hooks.ts'
import { useEffect, useState } from 'react'

type DishCardCartProps = {
    item: IDish
    setSelectedDish: (dish: IDish) => void
    dispatch: ReturnType<typeof useAppDispatch>
}

export const DishCardCart = ({
    item,
    setSelectedDish,
    dispatch,
}: DishCardCartProps) => {
    const [currentDish, setCurrentDish] = useState<IDish>(item)
    useEffect(() => {
        setCurrentDish({ ...structuredClone(item), count: item.count ?? 1 })
    }, [item])
    const [extras, setExtras] = useState('')
    useEffect(() => {
        setExtras(
            item.extras
                .filter((extra) => extra.applied)
                .map((extra) => extra.name)
                .join(', '),
        )
    }, [extras, item.extras])
    return (
        <li
            key={item.cartId}
            className={
                'flex min-h-[12rem] max-w-lg gap-5 rounded-3xl border-2 border-primary-700 p-4 hover:bg-primary-50/50'
            }>
            <img
                src={item.image}
                alt={item.name}
                className={
                    'aspect-square h-28 shrink-0 rounded-3xl object-cover sm:h-40'
                }
            />
            <div className={'flex h-full w-full flex-col gap-1'}>
                <span className={'flex justify-between max-[375px]:flex-col'}>
                    <h2
                        className={
                            'text-2xl text-accent-800  max-[375px]:text-xl'
                        }>
                        {item.name}
                    </h2>
                    {item.status === DishStatus.NEW && (
                        <span
                            className={
                                'mb-auto ml-auto flex gap-3 pl-3 text-primary-700'
                            }>
                            <button onClick={() => setSelectedDish(item)}>
                                <EditRounded />
                            </button>
                            <button
                                onClick={() =>
                                    dispatch(
                                        removeFromCart(
                                            currentDish.cartId as string,
                                        ),
                                    )
                                }>
                                <DeleteRounded />
                            </button>
                        </span>
                    )}
                </span>
                {item.extras.filter((extra) => extra.applied).length > 0 && (
                    <div className={'flex flex-col gap-1'}>
                        <h3 className={'text-accent-800'}>Добавки</h3>
                        <p className={'flex flex-wrap gap-1'}>{extras}</p>
                    </div>
                )}
                <div
                    className={
                        'mt-auto flex flex-wrap items-center justify-between'
                    }>
                    <CountInput
                        disabled={item.status !== DishStatus.NEW}
                        count={currentDish.count ?? 1}
                        onCountChange={(count) =>
                            dispatch(updateCartItem({ ...item, count }))
                        }
                    />
                    <p className={'text-lg font-semibold text-primary-700'}>
                        {getDishTotal(item)}₽
                    </p>
                </div>
            </div>
        </li>
    )
}
