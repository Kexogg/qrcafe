import { Table } from '../Table/Table.tsx'
import { TableButton } from '../TableButton/TableButton.tsx'
import { EditRounded, FilterListRounded } from '@mui/icons-material'
import { ReactNode, useState } from 'react'
import { WithId } from '../../../types/types.ts'

interface IColumn {
    name: string
    key: string
    func?: (param: never) => string
    shrink?: boolean
}

type AutoTableProps<T extends WithId> = {
    data: T[]
    columns: IColumn[]
    selected?: T[]
    onSelected?: (rows: T[]) => void
    onEdit?: (row: T) => void
    customButtons?: {
        icon: ReactNode
        onClick: (row: T) => void
    }[]
}

export const AutoTable = <T extends WithId>({
    data,
    columns,
    selected,
    onSelected,
    onEdit,
    customButtons,
}: AutoTableProps<T>) => {
    const getCellValue = (row: T, column: IColumn) => {
        if (column.func) {
            return column.func(row[column.key] as never)
        }
        return row[column.key]
    }
    const [sortBy, setSortBy] = useState<number>(-1)
    const [sortOrder, setSortOrder] = useState<number>(1)
    const sortedData =
        sortBy === -1
            ? data
            : structuredClone(data).sort((a, b) => {
                  return (getCellValue(a, columns[sortBy]) as number) >
                      (getCellValue(b, columns[sortBy]) as number)
                      ? sortOrder
                      : -1 * sortOrder
              })

    return (
        <Table>
            <thead>
                <tr>
                    {selected && <th></th>}
                    {columns.map((column, index) => (
                        <th
                            onClick={() => {
                                if (sortBy === index) {
                                    if (sortOrder === -1) {
                                        setSortBy(-1)
                                    }
                                    setSortOrder(sortOrder * -1)
                                } else {
                                    setSortBy(index)
                                    setSortOrder(1)
                                }
                            }}
                            key={column.key + column.name}
                            className={`${column.shrink ?? 'whitespace-nowrap'} column-sortable`}>
                            <span
                                className={`block whitespace-nowrap ${sortBy !== index && 'px-[10px]'}`}>
                                <span>{column.name}</span>
                                {sortBy === index && (
                                    <span>
                                        <FilterListRounded
                                            className={`${sortOrder === 1 ? 'rotate-180' : ''}`}
                                            fontSize={'small'}
                                        />
                                    </span>
                                )}
                            </span>
                        </th>
                    ))}
                    {(onEdit || customButtons) && <th></th>}
                </tr>
            </thead>
            <tbody>
                {sortedData.map((row) => (
                    <tr key={row.id}>
                        {selected && (
                            <td className={'w-0'}>
                                <input
                                    type={'checkbox'}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            onSelected?.([...selected, row])
                                        } else {
                                            onSelected?.(
                                                selected.filter(
                                                    (r) => r !== row,
                                                ),
                                            )
                                        }
                                    }}
                                />
                            </td>
                        )}
                        {columns.map((column) => (
                            <td
                                key={column.key + column.name}
                                className={`${
                                    column.shrink && 'w-0 whitespace-nowrap'
                                }`}>
                                <>{getCellValue(row, column)}</>
                            </td>
                        ))}
                        {(onEdit || customButtons) && (
                            <td className={'w-0 whitespace-nowrap'}>
                                <div className={'flex gap-1'}>
                                    {onEdit && (
                                        <TableButton
                                            onClick={() => onEdit?.(row)}>
                                            <EditRounded fontSize={'small'} />
                                        </TableButton>
                                    )}
                                    {customButtons &&
                                        customButtons.map((button) => (
                                            <TableButton
                                                key={button.icon?.toString()}
                                                onClick={() =>
                                                    button.onClick(row)
                                                }>
                                                {button.icon}
                                            </TableButton>
                                        ))}
                                </div>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}
