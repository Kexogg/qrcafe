import { DashboardPageTemplate } from '../DashboardPageTemplate/DashboardPageTemplate.tsx'
import { deleteClient, getClients } from '../../../api/api.ts'
import { IOrderEntry } from '../../../types/IOrderEntry.ts'
import { getOrderEntryTotal } from '../../../types/IDish.ts'

export const DashboardOrders = () => {
    return (
        <DashboardPageTemplate
            pageTitle={'Заказы'}
            getItems={getClients}
            deleteItem={deleteClient}
            tableColumns={[
                {
                    name: 'Столик',
                    key: 'tableId',
                    shrink: true,
                },
                {
                    name: 'Кол-во блюд',
                    key: 'order',
                    shrink: true,
                    func: (param: IOrderEntry[]) =>
                        param
                            ? param
                                  .reduce(
                                      (acc, orderEntry) =>
                                          acc + orderEntry.count,
                                      0,
                                  )
                                  .toString()
                            : '',
                },
                {
                    name: 'Сумма',
                    key: 'order',
                    shrink: true,
                    func: (param: IOrderEntry[]) =>
                        param
                            .reduce(
                                (acc, orderEntry) =>
                                    acc + getOrderEntryTotal(orderEntry),
                                0,
                            )
                            .toString() + ' ₽',
                },
                {
                    name: 'Клиент',
                    key: 'name',
                },
                /*{
                    name: 'Официант',
                    key: 'assignedEmployee',
                    func: (param: IEmployee) => param.fullName,
                },*/
            ]}
        />
    )
}
