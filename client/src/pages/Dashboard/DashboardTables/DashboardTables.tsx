import { deleteTable, getTables } from '../../../api/api.ts'
import { useState } from 'react'
import { ITable } from '../../../types/ITable.ts'
import { QrCodeRounded } from '@mui/icons-material'
import { TableQrModal } from './TableQrModal.tsx'
import { DashboardPageTemplate } from '../DashboardPageTemplate/DashboardPageTemplate.tsx'
import { useNavigate } from 'react-router-dom'
import { IEmployee } from '../../../types/IEmployee.ts'
import { IClient } from '../../../types/IClient.ts'
export const DashboardTables = () => {
    const [qrModalTable, setQrModalTable] = useState<ITable | null>(null)
    const navigate = useNavigate()
    return (
        <section className={'relative'}>
            <TableQrModal
                open={!!qrModalTable}
                onClose={() => setQrModalTable(null)}
                table={qrModalTable as ITable}></TableQrModal>
            <DashboardPageTemplate
                pageTitle={'Столики'}
                getItems={getTables}
                deleteItem={deleteTable}
                createItem={async () => {
                    navigate('edit')
                }}
                tableColumns={[
                    { name: 'ID', key: 'id', shrink: true },
                    { name: 'Название', key: 'name' },
                    {
                        name: 'Официант',
                        key: 'assignedEmployee',
                        func: (param: IEmployee) =>
                            param ? param.fullName : 'Не назначен',
                    },
                    {
                        name: 'Статус',
                        key: 'client',
                        shrink: true,
                        func: (param: IClient) =>
                            param ? 'Занят' : 'Свободен',
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
                onTableRowEdit={(row) => navigate(`edit/${row.id}`)}
            />
        </section>
    )
}
