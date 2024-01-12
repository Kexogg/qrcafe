import { ITable } from '../../../types/ITable.ts'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../Button/Button.tsx'
import { FoodStatus } from '../../../types/IOrderEntry.ts'

type TableCardProps = {
    table: ITable
}

export const TableCard = ({ table }: TableCardProps) => {
    const navigate = useNavigate()
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
                    {table.client === null && 'Свободен'}
                    {table.client && 'Занят'}
                </span>
            </span>
            {table.client === null && (
                <Button
                    dark
                    label={'Создать заказ'}
                    onClick={() => navigate(`/employee/new-order/${table.id}`)}
                />
            )}
            {table.client?.order && table.client.order.length > 0 && (
                <ul className={'flex flex-col gap-3'}>
                    {structuredClone(table.client.order)
                        .sort(
                            (dish) =>
                                dish.state === FoodStatus.COOKED ? 0 : 1,
                            //Display ready to serve dishes first
                        )
                        .map((dish) => (
                            <li key={dish.id} className={'flex gap-3'}>
                                <img
                                    alt={dish.food.name}
                                    className={
                                        'aspect-square h-14 rounded-xl object-cover'
                                    }
                                    src={dish.food.imageUrl}
                                />
                                <div>
                                    <h3>{dish.food.name}</h3>
                                    {dish.state === FoodStatus.COOKING && (
                                        <span className={'text-neutral-700'}>
                                            Готовится
                                        </span>
                                    )}
                                    {dish.state === FoodStatus.COOKED && (
                                        <span
                                            className={
                                                'font-bold text-accent-700'
                                            }>
                                            Готово
                                        </span>
                                    )}
                                    {dish.state === FoodStatus.SERVED && (
                                        <span className={'text-green-600'}>
                                            Подано
                                        </span>
                                    )}
                                    {dish.state === FoodStatus.CANCELED && (
                                        <span className={'text-neutral-400'}>
                                            Отменено
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                </ul>
            )}
            {table.client?.order && table.client.order.length > 0 && (
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
