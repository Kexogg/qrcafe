import { DashboardEditorTemplate } from '../DashboardEditorTemplate/DashboardEditorTemplate.tsx'
import {
    createCategory,
    getCategoryById,
    updateCategory,
} from '../../../api/api.ts'
import { useParams } from 'react-router-dom'

export const DashboardCatalogEditor = () => {
    const params = useParams()
    return (
        <DashboardEditorTemplate
            pageTitle={'Редактирование категории'}
            createItem={createCategory}
            updateItem={updateCategory}
            getItem={getCategoryById}
            id={params.id}
            properties={[
                {
                    name: 'Название',
                    key: 'name',
                    type: 'text',
                },
                {
                    name: 'Описание',
                    key: 'description',
                    type: 'text',
                },
                {
                    name: 'Публиковать',
                    key: 'available',
                    type: 'checkbox',
                },
                {
                    name: 'Витрина',
                    key: 'separate',
                    type: 'checkbox',
                },
                {
                    name: 'Позиция',
                    key: 'order',
                    type: 'number',
                },
            ]}
        />
    )
}
