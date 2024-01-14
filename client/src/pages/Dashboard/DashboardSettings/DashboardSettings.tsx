import { Button } from '../../../components/UI/Button/Button.tsx'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts'
import { CLEAR_STATE } from '../../../store.ts'
import { DashboardEditorTemplate } from '../DashboardEditorTemplate/DashboardEditorTemplate.tsx'
import { getRestaurant, updateRestaurant } from '../../../api/api.ts'

export const DashboardSettings = () => {
    const dispatch = useAppDispatch()
    const session = useAppSelector((state) => state.session)
    return (
        <>
            <DashboardEditorTemplate
                pageTitle={'Настройки'}
                getItem={getRestaurant}
                updateItem={updateRestaurant}
                id={session.restaurantId!}
                properties={[
                    {
                        name: 'Название',
                        key: 'name',
                        type: 'text',
                    },
                    {
                        name: 'Адрес',
                        key: 'address',
                        type: 'text',
                    },
                ]}
            />
            <Button
                label={'Выйти'}
                onClick={() => dispatch({ type: CLEAR_STATE })}
            />
        </>
    )
}
