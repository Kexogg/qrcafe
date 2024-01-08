import { DashboardPageTemplate } from '../DashboardPageTemplate/DashboardPageTemplate.tsx'
import { deleteCategory, getCategories } from '../../../api/api.ts'
import { useNavigate } from 'react-router-dom'

export const DashboardCatalog = () => {
    const navigate = useNavigate()
    return (
        <DashboardPageTemplate
            pageTitle={'Меню'}
            getItems={getCategories}
            deleteItem={deleteCategory}
            createItem={async () => navigate('edit')}
            tableColumns={[
                {
                    name: 'Название',
                    key: 'name',
                },
                {
                    name: 'Описание',
                    key: 'description',
                },
            ]}
            onTableRowEdit={(row) => navigate(`edit/${row.id}`)}
        />
    )
}
