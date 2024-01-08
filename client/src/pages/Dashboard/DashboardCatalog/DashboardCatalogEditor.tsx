import { DashboardEditorTemplate } from '../DashboardEditorTemplate/DashboardEditorTemplate.tsx'
import {
    createCategory,
    getCategories,
    updateCategory,
} from '../../../api/api.ts'

export const DashboardCatalogEditor = () => {
    return (
        <DashboardEditorTemplate
            pageTitle={'Редактирование категории'}
            createItem={createCategory}
            updateItem={updateCategory}
            getItem={getCategories}
            properties={[
                {
                    name: 'Название',
                    key: 'name',
                },
                {
                    name: 'Описание',
                    key: 'description',
                },
            ]}
        />
    )
}
