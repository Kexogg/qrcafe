import { DashboardPageTemplate } from '../DashboardPageTemplate/DashboardPageTemplate.tsx'
import { deleteClient, getClients } from '../../../api/api.ts'
import { IOrderEntry } from '../../../types/IOrderEntry.ts'

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
                                          acc + orderEntry.count ?? 1,
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
                                    acc + orderEntry.food.price,
                                0,
                            )
                            .toString() + ' ₽',
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
