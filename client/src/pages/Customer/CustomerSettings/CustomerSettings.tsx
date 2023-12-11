import { BuildInfo } from '../../../components/BuildInfo/BuildInfo.tsx'
import { PageTitle } from '../../../components/UI/PageTitle/PageTitle.tsx'
import { useAppSelector } from '../../../hooks.ts'
import { Button } from '../../../components/UI/Button/Button.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import { useState } from 'react'

export const CustomerSettings = () => {
    const state = useAppSelector((state) => state)
    const [modalOpen, setModalOpen] = useState(false)
    return (
        <section className={'flex flex-col gap-5 px-3'}>
            <Modal
                autoHeight
                title={'Вы уверены, что хотите выйти?'}
                open={modalOpen}
                onClose={() => setModalOpen(false)}>
                <p>
                    При выходе из приложения данные будут безвозвратно утеряны
                </p>
                <Button
                    dark
                    label={'Выйти'}
                    onClick={() => {
                        localStorage.clear()
                        window.location.href = '/'
                    }}
                />
            </Modal>
            <PageTitle title={'Настройки'} />
            <span className={'flex max-w-sm flex-col gap-2'}>
                <Button
                    label={'Удалить данные и выйти'}
                    dark
                    onClick={() => setModalOpen(true)}
                />
                <Button
                    label={'Перезагрузить страницу'}
                    onClick={() => window.location.reload()}
                />
            </span>
            <h2 className={'text-accent-800'}>Диагностические данные</h2>
            <div className={'overflow-x-scroll bg-white'}>
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
