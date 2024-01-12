import { Table } from '../Table/Table.tsx'
import { TableButton } from '../TableButton/TableButton.tsx'
import { EditRounded } from '@mui/icons-material'
import { ReactNode } from 'react'
import { WithId } from '../../../types/types.ts'

type AutoTableProps<T extends WithId> = {
    data: T[]
    columns: {
        name: string
        key: string
        func?: (param: any) => string
        shrink?: boolean
    }[]
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
    return (
        <Table>
            <thead>
                <tr>
                    {selected && <th></th>}
                    {columns.map((column) => (
                        <th
                            key={column.key + column.name}
                            className={
                                column.shrink ? 'whitespace-nowrap' : ''
                            }>
                            {column.name}
                        </th>
                    ))}
                    {onEdit && <th></th>}
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
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
                                {column.func
                                    ? column.func(row[column.key])
                                    : (row[column.key] as string)}
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
