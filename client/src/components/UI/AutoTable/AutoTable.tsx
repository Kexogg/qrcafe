import { Table } from '../Table/Table.tsx'
import { TableButton } from '../TableButton/TableButton.tsx'
import { EditRounded } from '@mui/icons-material'
import { ReactNode } from 'react'

type AutoTableProps = {
    data: never[]
    columns: {
        name: string
        key: string
        func?: (param: string | number) => string
    }[]
    selected?: never[]
    onSelected?: (rows: never[]) => void
    onEdit?: (row: never) => void
    rowKey?: string
    customButtons?: {
        icon: ReactNode
        onClick: (row: never) => void
    }[]
}

export const AutoTable = ({
    data,
    columns,
    selected,
    onSelected,
    onEdit,
    rowKey,
    customButtons,
}: AutoTableProps) => {
    return (
        <Table>
            <thead>
                <tr>
                    {selected && <th></th>}
                    {columns.map((column) => (
                        <th key={column.key}>{column.name}</th>
                    ))}
                    {onEdit && <th></th>}
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <tr key={row[rowKey ?? 'id']}>
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
                            <td key={column.key}>
                                {column.func
                                    ? column.func(row[column.key])
                                    : row[column.key]}
                            </td>
                        ))}
                        {(onEdit || customButtons) && (
                            <td className={'w-0 whitespace-nowrap'}>
                                <div className={'flex gap-1'}>
                                    <TableButton onClick={() => onEdit?.(row)}>
                                        <EditRounded fontSize={'small'} />
                                    </TableButton>
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
