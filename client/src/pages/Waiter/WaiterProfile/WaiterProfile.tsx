import { PageTitle } from '../../../components/UI/PageTitle/PageTitle.tsx'
import { Button } from '../../../components/UI/Button/Button.tsx'
import { useAppDispatch } from '../../../hooks.ts'
import { resetSession } from '../../../features/session/sessionSlice.ts'

export const WaiterProfile = () => {
    const dispatch = useAppDispatch()
    const logout = () => {
        dispatch(resetSession())
    }
    return (
        <section>
            <PageTitle title={'Профиль'} />
            <Button label={'Выйти'} onClick={logout} />
        </section>
    )
}
