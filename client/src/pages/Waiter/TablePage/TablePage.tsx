import { ITable } from '../../../types/ITable.ts'
import { useLocation } from 'react-router-dom'
import { PageTitle } from '../../../components/UI/PageTitle/PageTitle.tsx'
import { getDishTotal } from '../../../types/IDish.ts'
import { Button } from '../../../components/UI/Button/Button.tsx'

export const TablePage = () => {
    const location = useLocation()
    const table = location.state as ITable
    return (
        <section className={'flex flex-col gap-3 px-3'}>
            <PageTitle title={table.name} />
            {table.customerName && <p>Имя: {table.customerName}</p>}
            {table.assignedWaiter && <p>Официант: {table.assignedWaiter}</p>}
            {/*TODO: get waiter name from id*/}
            <h2>Заказ</h2>
            <div className={'rounded-3xl border-2 border-primary-700 p-5'}>
                <ul>
                    {table.order.map((dish) => (
                        <li key={dish.id} className={'flex justify-between'}>
                            <span>
                                <span className={'font-semibold'}>
                                    {dish.name}
                                </span>
                                , {dish.count ?? 1} шт.
                                {dish.extras.length > 0 && (
                                    <>
                                        <br />
                                        <span className={'text-neutral-500'}>
                                            {dish.extras
                                                .filter(
                                                    (extra) => !extra.applied,
                                                )
                                                .map((extra) => extra.name)
                                                .join(', ')}
                                        </span>
                                    </>
                                )}
                            </span>
                            <span className={'shrink-0'}>
                                {getDishTotal(dish)} ₽
                            </span>
                        </li>
                    ))}
                </ul>
                <hr className={'border-b-1 my-2 border-primary-700'} />
                <span className={'flex justify-between text-lg font-bold'}>
                    <span>Сумма заказа: </span>
                    {table.order.reduce(
                        (acc, dish) => acc + getDishTotal(dish),
                        0,
                    )}{' '}
                    ₽
                </span>
            </div>
            <div className={'flex flex-col gap-3'}>
                <Button dark label={'Открыть чат'} />
                <div className={'grid gap-3 sm:grid-cols-2'}>
                    <Button border label={'Закрыть стол'} />
                    <Button border label={'Редактировать'} />
                </div>
            </div>
        </section>
    )
}
