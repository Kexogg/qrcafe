import { useEffect, useState } from 'react'
import { IEmployee } from '../../../types/IEmployee.ts'
import { deleteEmployee, getEmployees } from '../../../api/api.ts'
import { useAppSelector } from '../../../hooks/hooks.ts'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'
import { TableButton } from '../../../components/UI/TableButton/TableButton.tsx'
import { AddRounded, DeleteRounded, RefreshRounded } from '@mui/icons-material'
import { CreateEmployeeModal } from './CreateEmployeeModal.tsx'
import { AutoTable } from '../../../components/UI/AutoTable/AutoTable.tsx'

export const DashboardEmployees = () => {
    const [employees, setEmployees] = useState<IEmployee[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [lastUpdate, setLastUpdate] = useState(Date.now())
    const [selectedEmployees, setSelectedEmployees] = useState<IEmployee[]>([])
    const [createEmployeeModal, setCreateEmployeeModal] = useState(false)
    const session = useAppSelector((state) => state.session)
    useEffect(() => {
        getEmployees(session.token as string, session.restaurantId as string)
            .then((response) => {
                setEmployees(response)
            })
            .catch((response) => {
                setError(response.message)
            })
            .finally(() => setLoading(false))
    }, [lastUpdate, session.restaurantId, session.token])
    return (
        <section className={'relative'}>
            {loading && <LoadingSpinner elementOverlay />}
            <CreateEmployeeModal
                open={createEmployeeModal}
                onClose={() => {
                    setCreateEmployeeModal(false)
                    setLastUpdate(Date.now())
                }}
            />
            <h1>Сотрудники</h1>
            {error}
            <div
                className={`flex flex-col gap-3 ${
                    loading && 'animate-pulse opacity-75'
                }`}>
                <AutoTable
                    data={employees as never[]}
                    selected={selectedEmployees as never[]}
                    onSelected={(rows) => {
                        setSelectedEmployees(rows as IEmployee[])
                    }}
                    rowKey={'id'}
                    columns={[
                        { name: 'Полное имя', key: 'fullName' },
                        { name: 'Логин', key: 'login' },
                        { name: 'Должность', key: 'role' },
                        {
                            name: 'Статус',
                            key: 'available',
                            func: (param) =>
                                param ? 'На смене' : 'Не на смене',
                        },
                    ]}
                />
                <div className={'flex gap-2'}>
                    {' '}
                    <TableButton
                        disabled={selectedEmployees.length === 0}
                        onClick={() => {
                            setLoading(true)
                            for (const employee of selectedEmployees) {
                                console.log('Deleting ' + employee.id)
                                deleteEmployee(
                                    session.token as string,
                                    session.restaurantId as string,
                                    employee.id,
                                )
                                    .catch((e) => {
                                        setError(e.message)
                                        throw e
                                    })
                                    .finally(() => {
                                        setSelectedEmployees([])
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
                            setCreateEmployeeModal(true)
                        }}>
                        <AddRounded />
                    </TableButton>
                </div>
                <small>
                    Обновлено: {new Date(lastUpdate).toLocaleTimeString()}
                </small>
            </div>
        </section>
    )
}
