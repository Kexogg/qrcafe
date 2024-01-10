import { DashboardEditorTemplate } from '../DashboardEditorTemplate/DashboardEditorTemplate.tsx'
import {
    createCategory,
    getCategoryById,
    updateCategory,
} from '../../../api/api.ts'
import { useParams } from 'react-router-dom'
import { IDish } from '../../../types/IDish.ts'
import { CatalogEditorSelector } from './CatalogEditorSelector.tsx'

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
                    required: true,
                },
                {
                    name: 'Описание',
                    key: 'description',
                    type: 'text',
                    required: true,
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
                {
                    name: 'Еда',
                    key: 'foodList',
                    type: 'custom',
                    customComponent: (props) => (
                        <CatalogEditorSelector
                            value={(props.value as IDish[]) ?? []}
                            onChange={props.onChange}
                        />
                    ),
                },
            ]}
        />
    )
}
