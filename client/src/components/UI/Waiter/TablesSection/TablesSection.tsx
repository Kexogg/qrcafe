import { ITable } from '../../../../types/ITable.ts'
import { TableCard } from '../../TableCard/TableCard.tsx'
import { useState } from 'react'
import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material'

type TablesSectionProps = {
    tables: ITable[]
    title?: string
}
export const TablesSection = ({ tables, title }: TablesSectionProps) => {
    const [hidden, setHidden] = useState(false)
    if (tables.length > 0)
        return (
            <li>
                {title && (
                    <div className={'flex justify-between py-2'}>
                        <h2>
                            {title}
                            {hidden && ` (${tables.length})`}
                        </h2>
                        <button onClick={() => setHidden(!hidden)}>
                            {hidden ? (
                                <ExpandMoreRounded fontSize={'large'} />
                            ) : (
                                <ExpandLessRounded fontSize={'large'} />
                            )}
                        </button>
                    </div>
                )}
                {!hidden && (
                    <ul className={'flex flex-col gap-3'}>
                        {tables.map((table) => (
                            <TableCard key={table.id} table={table} />
                        ))}
                    </ul>
                )}
            </li>
        )
    else return null
}
