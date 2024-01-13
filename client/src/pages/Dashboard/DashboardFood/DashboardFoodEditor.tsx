import { useParams } from 'react-router-dom'

import { createFood, getFoodById, updateFood } from '../../../api/api.ts'
import { DashboardEditorTemplate } from '../DashboardEditorTemplate/DashboardEditorTemplate.tsx'
import { FoodExtrasSelector } from './FoodExtrasSelector.tsx'
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
                    name: 'Название',
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
                {
                    name: 'Добавки',
                    key: 'extras',
                    type: 'custom',
                    customComponent: (props) => (
                        <FoodExtrasSelector
                            value={
                                (props.value as {
                                    name: string
                                    id: number
                                    price: number
                                }[]) ?? []
                            }
                            onChange={props.onChange}
                        />
                    ),
                },
            ]}
            id={params.id}
        />
    )
}
