import { deleteFood, getFood } from '../../../api/api.ts'
import { useNavigate } from 'react-router-dom'
import { DashboardPageTemplate } from '../DashboardPageTemplate/DashboardPageTemplate.tsx'

export const DashboardFood = () => {
    const navigate = useNavigate()

    return (
        <DashboardPageTemplate
            pageTitle={'Блюда'}
            getItems={getFood}
            createItem={async () => navigate('edit')}
            deleteItem={deleteFood}
            tableColumns={[
                { name: 'Название', key: 'name' },
                { name: 'Цена', key: 'price' },
                { name: 'Описание', key: 'description' },
            ]}
            onTableRowEdit={(row) => navigate(`edit/${row.id}`)}
        />
    )
}
