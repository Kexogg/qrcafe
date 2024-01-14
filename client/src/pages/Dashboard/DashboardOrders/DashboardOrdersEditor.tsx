/*import { DashboardEditorTemplate } from '../DashboardEditorTemplate/DashboardEditorTemplate.tsx'
import { getOrderById, updateOrderItem } from '../../../api/api.ts'
import { useParams } from 'react-router-dom'
import { IOrderEntry } from '../../../types/IOrderEntry.ts'
import { WithId } from '../../../types/types.ts'

export const DashboardOrdersEditor = () => {
    /*const params = useParams()
    const updateItem = async <T extends WithId>(
        token: string,
        restaruantId: string,
        items: IOrderEntry[],
    ): Promise<IOrderEntry[]> => {
        const responseItems = []
        for (const item of items) {
            const response = await updateOrderItem(
                token,
                restaruantId,
                item.id,
                item,
            )
            responseItems.push(response.data)
        }
        return responseItems as T[]
    }
    return (
        <DashboardEditorTemplate
            getItem={getOrderById}
            pageTitle={'Заказ'}
            properties={[
                {
                    name: 'Столик',
                    key: 'tableId',
                    type: 'number',
                },
                {
                    name: 'Клиент',
                    key: 'name',
                    type: 'text',
                },
                {
                    name: 'Официант',
                    key: 'assignedEmployee',
                    type: 'text',
                },
            ]}
            updateItem={updateItem}
            id={params.id}
        />
    )
}
*/
