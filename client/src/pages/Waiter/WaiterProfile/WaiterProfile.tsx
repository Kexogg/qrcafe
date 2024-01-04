import { PageTitle } from '../../../components/UI/PageTitle/PageTitle.tsx'
import { Button } from '../../../components/UI/Button/Button.tsx'
import { useAppDispatch } from '../../../hooks.ts'
import { CLEAR_STATE } from '../../../store.ts'

export const WaiterProfile = () => {
    const dispatch = useAppDispatch()
    return (
        <section>
            <PageTitle title={'Профиль'} />
            <Button
                label={'Выйти'}
                onClick={() => dispatch({ type: CLEAR_STATE })}
            />
        </section>
    )
}
