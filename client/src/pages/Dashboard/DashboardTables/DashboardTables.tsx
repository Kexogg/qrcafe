import { createTable, deleteTable, getTables } from '../../../api/api.ts'
import { useAppSelector } from '../../../hooks/hooks.ts'
import { useEffect, useState } from 'react'
import { ITable } from '../../../types/ITable.ts'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'
import { Button } from '../../../components/UI/Button/Button.tsx'
import {
    AddRounded,
    DeleteRounded,
    QrCodeRounded,
    RefreshRounded,
} from '@mui/icons-material'
import { TableButton } from '../../../components/UI/TableButton/TableButton.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import TextField from '../../../components/UI/Input/TextField/TextField.tsx'
import Dropdown from '../../../components/UI/Input/Dropdown/Dropdown.tsx'
import { TableQrModal } from './TableQrModal.tsx'
import { AutoTable } from '../../../components/UI/AutoTable/AutoTable.tsx'
export const DashboardTables = () => {
    const session = useAppSelector((state) => state.session)
    const [tables, setTables] = useState<ITable[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [lastUpdate, setLastUpdate] = useState(Date.now())
    const [selectedTable, setSelectedTable] = useState<ITable | null>(null)
    const [selectedTables, setSelectedTables] = useState<ITable[]>([])
    const [qrModalTable, setQrModalTable] = useState<ITable | null>(null)
    useEffect(() => {
        setLoading(true)
        getTables(session.token as string, session.restaurantId as string)
            .then((response) => {
                setTables(response)
            })
            .catch((response) => {
                setError(response.message)
            })
            .finally(() => setLoading(false))
    }, [session.restaurantId, session.token, lastUpdate])
    const updateTable = (table: ITable) => {
        console.log('Changing table ' + table.id)
        setSelectedTable(null)
    }
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
                    onClick={() => updateTable(selectedTable as ITable)}
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
            <h1>Столики</h1>
            {error && <p>{error}</p>}
            {loading && <LoadingSpinner elementOverlay />}
            {!error && (
                <div
                    className={`flex flex-col gap-3 ${
                        loading && 'animate-pulse opacity-75'
                    }`}>
                    <AutoTable
                        data={tables as never[]}
                        columns={[
                            { name: 'Номер', key: 'id' },
                            { name: 'Название', key: 'name' },
                            { name: 'Официант', key: 'assignedWaiter' },
                        ]}
                        customButtons={[
                            {
                                icon: <QrCodeRounded fontSize={'small'} />,
                                onClick: (row) => {
                                    console.log(row)
                                    setQrModalTable(row as ITable)
                                },
                            },
                        ]}
                        rowKey={'id'}
                        onEdit={(row) => {
                            setSelectedTable(row as ITable)
                        }}
                        selected={selectedTables as never[]}
                        onSelected={(rows) => {
                            setSelectedTables(rows as ITable[])
                        }}
                    />
                    <div className={'flex gap-2'}>
                        {' '}
                        <TableButton
                            disabled={selectedTables.length === 0}
                            onClick={() => {
                                setLoading(true)
                                for (const table of selectedTables) {
                                    console.log('Deleting table ' + table.id)
                                    deleteTable(
                                        session.token as string,
                                        session.restaurantId as string,
                                        table.id,
                                    )
                                        .catch((e) => {
                                            setError(e.message)
                                            throw e
                                        })
                                        .finally(() => {
                                            setSelectedTables([])
                                            setLastUpdate(Date.now())
                                        })
                                }
                            }}>
                            <DeleteRounded />
                        </TableButton>
                        <TableButton
                            onClick={() => {
                                setLastUpdate(Date.now())
                            }}>
                            <RefreshRounded />
                        </TableButton>
                        <TableButton
                            onClick={() => {
                                setLoading(true)
                                createTable(
                                    session.token as string,
                                    session.restaurantId as string,
                                    'Столик',
                                )
                                    .then(() => setLastUpdate(Date.now()))
                                    .catch((e) => {
                                        setError(e.message)
                                    })
                                    .finally(() => setLoading(false))
                            }}>
                            <AddRounded />
                        </TableButton>
                    </div>
                    <small>
                        Обновлено: {new Date(lastUpdate).toLocaleTimeString()}
                    </small>
                </div>
            )}
        </section>
    )
}
