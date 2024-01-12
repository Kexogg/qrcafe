import { ITable } from '../../../types/ITable.ts'
import { useEffect, useState } from 'react'
import { TablesSection } from '../../../components/UI/Waiter/TablesSection/TablesSection.tsx'
import { Searchbar } from '../../../components/UI/Searchbar/Searchbar.tsx'
import { TableRowsRounded } from '@mui/icons-material'
import { getEmployeeInfo, getTables } from '../../../api/api.ts'
import { useAppSelector } from '../../../hooks/hooks.ts'
import { IEmployee } from '../../../types/IEmployee.ts'

export const WaiterHome = () => {
    const [tables, setTables] = useState<ITable[]>([])
    const session = useAppSelector((state) => state.session)
    const [employee, setEmployee] = useState<IEmployee | null>()
    useEffect(() => {
        getTables(session.token!, session.restaurantId!).then((tables) =>
            setTables(tables),
        )
        getEmployeeInfo(session.token!, session.restaurantId!).then(
            (employee) => setEmployee(employee),
        )
    }, [session.restaurantId, session.token])
    useEffect(() => {}, [])
    const [occupiedTables, setOccupiedTables] = useState<ITable[]>([])
    const [openTables, setOpenTables] = useState<ITable[]>([])
    const [showAll, setShowAll] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    useEffect(() => {
        let filteredTables = tables.filter(
            (table) => {
                if (showAll) {
                    return true
                }
                return table.assignedEmployee?.id === employee?.id
            },
            [tables, showAll],
        )
        if (searchTerm) {
            filteredTables = filteredTables.filter((table) =>
                table.name.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }
        setOccupiedTables(
            filteredTables.filter((table) => table.assignedEmployee !== null),
        )
        setOpenTables(
            filteredTables.filter((table) => table.assignedEmployee === null),
        )
    }, [tables, showAll, searchTerm, employee?.id])

    return (
        <section className={'px-3'}>
            <h1>Столы</h1>
            <form
                className={
                    'flex rounded-full border-2 border-primary-700 text-center'
                }>
                <label
                    className={`w-1/2 cursor-pointer ${
                        !showAll && 'rounded-full bg-primary-700 text-white'
                    }`}>
                    <input
                        type={'radio'}
                        name={'tables'}
                        defaultChecked={true}
                        className={'appearance-none'}
                        onClick={() => setShowAll(false)}
                    />
                    Мои{''}
                </label>
                <label
                    className={`w-1/2 cursor-pointer ${
                        showAll && 'rounded-full bg-primary-700 text-white'
                    }`}>
                    <input
                        type={'radio'}
                        name={'tables'}
                        className={'appearance-none'}
                        onClick={() => setShowAll(true)}
                    />
                    Все{''}
                </label>
            </form>
            <div className={'flex items-center py-3'}>
                <Searchbar setSearchTerm={setSearchTerm} />
                <button>
                    <TableRowsRounded />
                </button>
            </div>

            <ul>
                {showAll ? (
                    <>
                        <TablesSection
                            tables={occupiedTables}
                            title={'Занятые столы'}
                        />
                        <TablesSection
                            tables={openTables}
                            title={'Свободные столы'}
                        />
                    </>
                ) : (
                    <TablesSection tables={occupiedTables} />
                )}
            </ul>
        </section>
    )
}
