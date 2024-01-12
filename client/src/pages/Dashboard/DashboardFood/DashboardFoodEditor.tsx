import { useParams } from 'react-router-dom'

import { createFood, getFoodById, updateFood } from '../../../api/api.ts'
import { DashboardEditorTemplate } from '../DashboardEditorTemplate/DashboardEditorTemplate.tsx'
export const DashboardFoodEditor = () => {
    const params = useParams()
    return (
        <DashboardEditorTemplate
            createItem={createFood}
            updateItem={updateFood}
            pageTitle={'Редактор еды'}
            getItem={getFoodById}
            properties={[
                {
                    name: 'Навзание',
                    key: 'name',
                    type: 'text',
                },
                {
                    name: 'Описание',
                    key: 'description',
                    type: 'textarea',
                },
                {
                    name: 'Доступно',
                    key: 'available',
                    type: 'checkbox',
                },
                {
                    name: 'Цена',
                    key: 'price',
                    type: 'text',
                },
                {
                    name: 'Вес',
                    key: 'weight',
                    type: 'text',
                },
                {
                    name: 'Картинка',
                    key: 'imageUrl',
                    type: 'image',
                },
            ]}
            id={params.id}
        />
    )
}
