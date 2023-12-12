import { ITable, TableStatus } from '../../../types/ITable.ts'
import { DishStatus } from '../../../types/IDish.ts'
import { Link } from 'react-router-dom'
import { Button } from '../Button/Button.tsx'

type TableCardProps = {
    table: ITable
}

export const TableCard = ({ table }: TableCardProps) => {
    return (
        <li
            className={
                'flex flex-col gap-3 rounded-3xl border-2 border-primary-700 p-5 text-primary-700'
            }>
            <span className={'flex items-center justify-between'}>
                <h2>{table.name}</h2>
                <span
                    className={
                        'rounded-full bg-accent-800 px-3 py-1  font-medium text-white'
                    }>
                    {table.status === TableStatus.OPEN && 'Свободен'}
                    {table.status === TableStatus.OCCUPIED && 'Занят'}
                    {table.status === TableStatus.RESERVED && 'Забронирован'}
                </span>
            </span>
            {table.status === TableStatus.OPEN && (
                <Button dark label={'Создать заказ'} />
            )}
            {table.order.length > 0 && (
                <ul className={'flex flex-col gap-3'}>
                    {structuredClone(table.order)
                        .sort(
                            (dish) =>
                                dish.status === DishStatus.COOKED ? 0 : 1,
                            //Display ready to serve dishes first
                        )
                        .map((dish) => (
                            <li key={dish.id} className={'flex gap-3'}>
                                <img
                                    alt={dish.name}
                                    className={
                                        'aspect-square h-14 rounded-xl object-cover'
                                    }
                                    src={dish.image}
                                />
                                <div>
                                    <h3>{dish.name}</h3>
                                    {dish.status === DishStatus.COOKING && (
                                        <span className={'text-neutral-700'}>
                                            Готовится
                                        </span>
                                    )}
                                    {dish.status === DishStatus.COOKED && (
                                        <span
                                            className={
                                                'font-bold text-accent-700'
                                            }>
                                            Готово
                                        </span>
                                    )}
                                    {dish.status === DishStatus.SERVED && (
                                        <span className={'text-green-600'}>
                                            Подано
                                        </span>
                                    )}
                                    {dish.status === DishStatus.CANCELED && (
                                        <span className={'text-neutral-400'}>
                                            Отменено
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                </ul>
            )}
            {table.order.length > 0 && (
                <Link
                    className={'text-center'}
                    to={`/employee/table/${table.id}`}
                    state={table}>
                    Показать больше
                </Link>
            )}
        </li>
    )
}
