import { DashboardEditorTemplate } from '../DashboardEditorTemplate/DashboardEditorTemplate.tsx'
import { createTable, getTableById, updateTable } from '../../../api/api.ts'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getQRValue } from '../../../helpers.ts'
import { useAppSelector } from '../../../hooks/hooks.ts'
import { IEmployee } from '../../../types/IEmployee.ts'

export const DashboardTableEditor = () => {
    const params = useParams()
    const restaurantId = useAppSelector((state) => state.session.restaurantId)
    const [QrCode, setQrCode] = useState<
        typeof import('react-qr-code').default | null
    >(null)
    useEffect(() => {
        import('react-qr-code').then((QRCode) => {
            setQrCode(QRCode.default)
        })
    }, [])
    if (!QrCode) return null
    return (
        <DashboardEditorTemplate
            pageTitle={'Редактирование столика'}
            createItem={createTable}
            updateItem={updateTable}
            getItem={getTableById}
            id={params.id}
            properties={[
                {
                    name: 'ID',
                    key: 'id',
                    requiresItem: true,
                },
                {
                    name: 'Название',
                    key: 'name',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'Официант',
                    key: 'assignedEmployee',
                    requiresItem: true,
                    type: 'custom',
                    customComponent: (props) => (
                        <>
                            {(props.value as IEmployee)?.fullName ??
                                'Не назначен'}
                        </>
                    ),
                },
                {
                    name: 'QR-код',
                    key: 'id',
                    type: 'custom',
                    requiresItem: true,
                    customComponent: (props) => (
                        <QrCode
                            className={'aspect-square h-20 w-20 bg-white p-1'}
                            value={getQRValue(
                                restaurantId!,
                                props.value as string,
                            )}
                        />
                    ),
                },
            ]}
        />
    )
}
