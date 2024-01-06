import { createTable, getTables } from '../../../api/api.ts'
import { useAppSelector } from '../../../hooks/hooks.ts'
import { useEffect, useState } from 'react'
import { ITable } from '../../../types/ITable.ts'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'
import { Button } from '../../../components/UI/Button/Button.tsx'
import {
    AddRounded,
    DeleteRounded,
    EditRounded,
    RefreshRounded,
} from '@mui/icons-material'
import { TableButton } from '../../../components/UI/TableButton/TableButton.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import TextField from '../../../components/UI/TextField/TextField.tsx'
import Dropdown from '../../../components/UI/Dropdown/Dropdown.tsx'

export const DashboardTables = () => {
    const session = useAppSelector((state) => state.session)
    const [tables, setTables] = useState<ITable[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [lastUpdate, setLastUpdate] = useState(Date.now())
    const [selectedTable, setSelectedTable] = useState<ITable | null>(null)
    const [selectedTables, setSelectedTables] = useState<ITable[]>([])
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
        //TODO
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
            <h1>Столики</h1>
            {error && <p>{error}</p>}
            {loading && <LoadingSpinner elementOverlay />}
            {!error && (
                <div
                    className={`flex flex-col gap-3 ${
                        loading && 'animate-pulse'
                    }`}>
                    <table className={'max-w-md border border-primary-700'}>
                        <thead>
                            <tr className={''}>
                                <th></th>
                                <th>ID</th>
                                <th>Имя</th>
                                <th>Официант</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tables.map((table) => (
                                <tr
                                    key={table.id}
                                    className={'hover:bg-primary-700/5'}>
                                    <td>
                                        <input
                                            type={'checkbox'}
                                            className={'cursor-pointer'}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedTables([
                                                        ...selectedTables,
                                                        table,
                                                    ])
                                                } else {
                                                    setSelectedTables((s) =>
                                                        s.filter(
                                                            (t) =>
                                                                t.id !==
                                                                table.id,
                                                        ),
                                                    )
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>{table.id}</td>
                                    <td>{table.name ?? '-'}</td>
                                    <td>{table.assignedWaiter}</td>
                                    <td>
                                        <TableButton
                                            onClick={() =>
                                                setSelectedTable(table)
                                            }>
                                            <EditRounded fontSize={'small'} />
                                        </TableButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className={'flex gap-2'}>
                        {' '}
                        <TableButton
                            disabled={selectedTables.length === 0}
                            onClick={() => {
                                //TODO: Delete selected
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
                                ).then(() => setLastUpdate(Date.now()))
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
