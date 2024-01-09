import {
    createTable,
    deleteTable,
    getTables,
    updateTable,
} from '../../../api/api.ts'
import { useAppSelector } from '../../../hooks/hooks.ts'
import { useState } from 'react'
import { ITable } from '../../../types/ITable.ts'
import { Button } from '../../../components/UI/Button/Button.tsx'
import { QrCodeRounded } from '@mui/icons-material'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import TextField from '../../../components/UI/Input/TextField/TextField.tsx'
import Dropdown from '../../../components/UI/Input/Dropdown/Dropdown.tsx'
import { TableQrModal } from './TableQrModal.tsx'
import { DashboardPageTemplate } from '../DashboardPageTemplate/DashboardPageTemplate.tsx'
export const DashboardTables = () => {
    const session = useAppSelector((state) => state.session)
    const [selectedTable, setSelectedTable] = useState<ITable | null>(null)
    const [qrModalTable, setQrModalTable] = useState<ITable | null>(null)

    return (
        <section className={'relative'}>
            <Modal
                title={`Столик ${selectedTable?.id}`}
                open={!!selectedTable}
                autoHeight
                onClose={() => setSelectedTable(null)}>
                <div className={'grid grid-cols-2 items-center'}>
                    Номер:
                    <TextField dark />
                    Название:
                    <TextField dark />
                    Официант:
                    <Dropdown options={[]} dark />
                </div>
                <Button
                    dark
                    label={'Сохранить'}
                    onClick={() =>
                        updateTable(
                            session.token!,
                            session.restaurantId!,
                            selectedTable as ITable,
                        )
                    }
                />
                <Button
                    border
                    label={'Отменить изменения'}
                    onClick={() => setSelectedTable(null)}
                />
            </Modal>
            <TableQrModal
                open={!!qrModalTable}
                onClose={() => setQrModalTable(null)}
                table={qrModalTable as ITable}></TableQrModal>
            <DashboardPageTemplate
                pageTitle={'Столики'}
                getItems={getTables}
                deleteItem={deleteTable}
                createItem={async () => {
                    await createTable(
                        session.token!,
                        session.restaurantId!,
                        'Столик',
                    )
                }}
                tableColumns={[
                    { name: 'Номер', key: 'id' },
                    { name: 'Название', key: 'name' },
                    {
                        name: 'Официант',
                        key: 'assignedWaiter',
                    },
                ]}
                tableCustomButtons={[
                    {
                        icon: <QrCodeRounded fontSize={'small'} />,
                        onClick: (row) => {
                            setQrModalTable(row as ITable)
                        },
                    },
                ]}
                onTableRowEdit={(row) => setSelectedTable(row as ITable)}
            />
        </section>
    )
}
