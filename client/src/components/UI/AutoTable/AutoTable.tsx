import { Table } from '../Table/Table.tsx'
import { TableButton } from '../TableButton/TableButton.tsx'
import { EditRounded } from '@mui/icons-material'

type AutoTableProps = {
    data: never[]
    columns: { name: string; key: string; func?: (param: string) => string }[]
    selected?: never[]
    onSelected?: (rows: never[]) => void
    onEdit?: (row: never) => void
    rowKey?: string
}

export const AutoTable = ({
    data,
    columns,
    selected,
    onSelected,
    onEdit,
    rowKey,
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
                        {onEdit && (
                            <td className={'w-0'}>
                                <TableButton onClick={() => onEdit(row)}>
                                    <EditRounded fontSize={'small'} />
                                </TableButton>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}
