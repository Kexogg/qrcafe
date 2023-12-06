import { BuildInfo } from '../../components/BuildInfo/BuildInfo.tsx'
import { PageTitle } from '../../components/UI/PageTitle/PageTitle.tsx'
import { useAppSelector } from '../../hooks.ts'
import { Button } from '../../components/UI/Button/Button.tsx'

export const CustomerSettings = () => {
    const state = useAppSelector((state) => state)
    return (
        <section className={'flex flex-col gap-5'}>
            <PageTitle title={'Настройки'} />
            <span className={'flex max-w-sm flex-col gap-2'}>
                <Button
                    label={'Удалить данные и выйти'}
                    dark
                    onClick={() => {
                        localStorage.clear()
                        window.location.href = '/'
                    }}
                />
                <Button
                    label={'Перезагрузить страницу'}
                    onClick={() => window.location.reload()}
                />
            </span>
            <h2 className={'text-accent-800'}>Диагностические данные</h2>
            <div className={'bg-white'}>
                <pre>
                    QR CAFE <BuildInfo />
                </pre>
                <pre className={'whitespace-pre-wrap'}>
                    {JSON.stringify(state)}
                </pre>
            </div>
        </section>
    )
}
