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
                {
                    name: 'Опубликовано',
                    key: 'available',
                    shrink: true,
                    func: (row) => (row ? 'Да' : 'Нет'),
                },
                {
                    name: 'Витрина',
                    key: 'separate',
                    shrink: true,
                    func: (row) => (row ? 'Да' : 'Нет'),
                },
                {
                    name: 'Позиция',
                    key: 'order',
                    shrink: true,
                },
            ]}
            onTableRowEdit={(row) => navigate(`edit/${row.id}`)}
        />
    )
}
