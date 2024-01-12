import { ITable } from '../../../types/ITable.ts'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageTitle } from '../../../components/UI/PageTitle/PageTitle.tsx'
import { getOrderEntryTotal } from '../../../types/IDish.ts'
import { Button } from '../../../components/UI/Button/Button.tsx'
import { deleteClient } from '../../../api/api.ts'
import { useAppSelector } from '../../../hooks/hooks.ts'

export const TablePage = () => {
    const location = useLocation()
    const table = location.state as ITable
    const session = useAppSelector((state) => state.session)
    const navigate = useNavigate()
    const closeTable = () => {
        deleteClient(
            session.token!,
            session.restaurantId!,
            table.client!.id,
        ).then(() => navigate(-1))
    }
    return (
        <section className={'flex flex-col gap-3 px-3'}>
            <PageTitle title={table.name} />
            {table.client && <p>Имя: {table.client.name}</p>}
            {table.assignedEmployee && (
                <p>Официант: {table.assignedEmployee.fullName}</p>
            )}
            <h2>Заказ</h2>
            <div className={'rounded-3xl border-2 border-primary-700 p-5'}>
                <ul>
                    {table.client?.order &&
                        table.client.order.map((dish) => (
                            <li
                                key={dish.id}
                                className={'flex justify-between'}>
                                <span>
                                    <span className={'font-semibold'}>
                                        {dish.food.name}
                                    </span>
                                    , {dish.count ?? 1} шт.
                                    {dish.food.extras.length > 0 && (
                                        <>
                                            <br />
                                            <span
                                                className={'text-neutral-500'}>
                                                {dish.food.extras
                                                    .filter(
                                                        (extra) =>
                                                            !extra.applied,
                                                    )
                                                    .map((extra) => extra.name)
                                                    .join(', ')}
                                            </span>
                                        </>
                                    )}
                                </span>
                                <span className={'shrink-0'}>
                                    {getOrderEntryTotal(dish)} ₽
                                </span>
                            </li>
                        ))}
                </ul>
                <hr className={'border-b-1 my-2 border-primary-700'} />
                <span className={'flex justify-between text-lg font-bold'}>
                    <span>Сумма заказа: </span>
                    {table.client?.order &&
                        table.client.order.reduce(
                            (acc, dish) => acc + getOrderEntryTotal(dish),
                            0,
                        )}{' '}
                    ₽
                </span>
            </div>
            <div className={'flex flex-col gap-3'}>
                <Button dark label={'Открыть чат'} />
                <div className={'grid gap-3 sm:grid-cols-2'}>
                    <Button
                        border
                        label={'Закрыть стол'}
                        onClick={closeTable}
                    />
                    <Button border label={'Редактировать'} />
                </div>
            </div>
        </section>
    )
}
