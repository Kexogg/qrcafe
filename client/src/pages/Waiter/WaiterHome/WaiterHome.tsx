import { ITable, TableStatus } from '../../../types/ITable.ts'
import { DishStatus, getPlaceholderDish } from '../../../types/IDish.ts'
import { useEffect, useMemo, useState } from 'react'
import { TablesSection } from '../../../components/UI/Waiter/TablesSection/TablesSection.tsx'
import { Searchbar } from '../../../components/UI/Searchbar/Searchbar.tsx'
import { TableRowsRounded } from '@mui/icons-material'

function getPlaceholderTables(): ITable[] {
    const tables: ITable[] = []
    for (let i = 0; i < 10; i++) {
        const isOccupied = Math.round(Math.random()) === 0
        isOccupied
            ? tables.push({
                  id: Math.random().toString(),
                  name: 'Столик ' + (i + 1),
                  order: [
                      { ...getPlaceholderDish(), status: DishStatus.COOKING },
                      { ...getPlaceholderDish(), status: DishStatus.COOKED },
                      { ...getPlaceholderDish(), status: DishStatus.SERVED },
                      { ...getPlaceholderDish(), status: DishStatus.CANCELED },
                  ],
                  status: TableStatus.OCCUPIED,
                  assignedWaiter: Math.round(Math.random()).toString(),
              })
            : tables.push({
                  id: Math.random().toString(),
                  name: 'Столик ' + (i + 1),
                  order: [],
                  status: TableStatus.OPEN,
              })
    }
    return tables
}

export const WaiterHome = () => {
    const tables: ITable[] = useMemo(() => getPlaceholderTables(), [])
    const [occupiedTables, setOccupiedTables] = useState<ITable[]>([])
    const [openTables, setOpenTables] = useState<ITable[]>([])
    const [reservedTables, setReservedTables] = useState<ITable[]>([])
    const [showAll, setShowAll] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    useEffect(() => {
        let filteredTables = tables.filter(
            (table) => {
                if (showAll) {
                    return true
                }
                //TODO: use waiter id here
                return table.assignedWaiter === '1'
            },
            [tables, showAll],
        )
        if (searchTerm) {
            filteredTables = filteredTables.filter((table) =>
                table.name.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }
        setOccupiedTables(
            filteredTables.filter(
                (table) => table.status === TableStatus.OCCUPIED,
            ),
        )
        setOpenTables(
            filteredTables.filter((table) => table.status === TableStatus.OPEN),
        )
        setReservedTables(
            filteredTables.filter(
                (table) => table.status === TableStatus.RESERVED,
            ),
        )
    }, [tables, showAll, searchTerm])

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
                        <TablesSection
                            tables={reservedTables}
                            title={'Забронированные столы'}
                        />
                    </>
                ) : (
                    <TablesSection tables={occupiedTables} />
                )}
            </ul>
        </section>
    )
}
