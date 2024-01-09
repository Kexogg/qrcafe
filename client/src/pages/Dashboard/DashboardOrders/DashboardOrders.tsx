import { DashboardPageTemplate } from '../DashboardPageTemplate/DashboardPageTemplate.tsx'
import { getOrders } from '../../../api/api.ts'

export const DashboardOrders = () => {
    return (
        <DashboardPageTemplate
            pageTitle={'Заказы'}
            getItems={getOrders}
            tableColumns={[
                {
                    name: 'Название',
                    key: 'name',
                },
            ]}
        />
    )
}
