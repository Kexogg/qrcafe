import { DashboardPageTemplate } from '../DashboardPageTemplate/DashboardPageTemplate.tsx'
import { getClients } from '../../../api/api.ts'

export const DashboardOrders = () => {
    return (
        <DashboardPageTemplate
            pageTitle={'Заказы'}
            getItems={getClients}
            tableColumns={[
                {
                    name: 'Название',
                    key: 'name',
                },
            ]}
        />
    )
}
