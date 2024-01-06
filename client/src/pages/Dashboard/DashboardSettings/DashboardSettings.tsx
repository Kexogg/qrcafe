import { Button } from '../../../components/UI/Button/Button.tsx'
import { useAppDispatch } from '../../../hooks/hooks.ts'
import { CLEAR_STATE } from '../../../store.ts'

export const DashboardSettings = () => {
    const dispatch = useAppDispatch()
    return (
        <section>
            <h1>Настройки</h1>
            <Button
                label={'Выйти'}
                onClick={() => dispatch({ type: CLEAR_STATE })}
            />
        </section>
    )
}
