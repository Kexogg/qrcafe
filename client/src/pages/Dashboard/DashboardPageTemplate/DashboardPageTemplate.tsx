import { useAppSelector } from '../../../hooks/hooks.ts'
import { ComponentProps, useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import { AutoTable } from '../../../components/UI/AutoTable/AutoTable.tsx'
import { AddRounded, DeleteRounded, RefreshRounded } from '@mui/icons-material'
import { TableButton } from '../../../components/UI/TableButton/TableButton.tsx'
import { WithId } from '../../../types/types.ts'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'

type DashboardPageTemplateProps<T extends WithId> = {
    pageTitle: string
    getItems: (token: string, restaurantId: string) => Promise<T[]>
    updateItem?: (
        token: string,
        restaurantId: string,
        item: T,
    ) => Promise<AxiosResponse<unknown, unknown>>
    deleteItem?: (
        token: string,
        restaurantId: string,
        itemId: string,
    ) => Promise<AxiosResponse<unknown>>
    createItem?: () => Promise<void>
    tableColumns: ComponentProps<typeof AutoTable>['columns']
    tableCustomButtons?: ComponentProps<typeof AutoTable>['customButtons']
    onTableRowEdit: (row: T) => void
}

export const DashboardPageTemplate = <T extends WithId>({
    pageTitle,
    getItems,
    deleteItem,
    createItem,
    tableColumns,
    tableCustomButtons,
    onTableRowEdit,
}: DashboardPageTemplateProps<T>) => {
    const [items, setItems] = useState<T[]>([])
    const [selectedItems, setSelectedItems] = useState<T[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [lastUpdate, setLastUpdate] = useState(Date.now())
    const session = useAppSelector((state) => state.session)
    useEffect(() => {
        getItems(session.token!, session.restaurantId!)
            .then((response) => {
                setItems(response)
            })
            .catch((response) => {
                setError(response.message)
            })
            .finally(() => setLoading(false))
    }, [getItems, session.restaurantId, session.token, lastUpdate])
    return (
        <section className={'relative'}>
            <h1>{pageTitle}</h1>
            {error}
            {loading && <LoadingSpinner elementOverlay />}
            <div
                className={`flex flex-col gap-3 ${
                    loading && 'animate-pulse opacity-75'
                }`}>
                <AutoTable
                    data={items as never[]}
                    columns={tableColumns}
                    customButtons={tableCustomButtons}
                    onEdit={onTableRowEdit}
                    selected={selectedItems as never[]}
                    onSelected={(rows) => {
                        setSelectedItems(rows)
                    }}
                />
                <div className={'flex gap-2'}>
                    {deleteItem && (
                        <TableButton
                            disabled={selectedItems.length === 0}
                            onClick={() => {
                                setLoading(true)
                                for (const item of selectedItems) {
                                    deleteItem(
                                        session.token!,
                                        session.restaurantId!,
                                        item.id,
                                    )
                                        .catch((e) => {
                                            setError(e.message)
                                        })
                                        .finally(() => {
                                            setSelectedItems([])
                                            setLastUpdate(Date.now())
                                        })
                                }
                            }}>
                            <DeleteRounded />
                        </TableButton>
                    )}
                    <TableButton
                        onClick={() => {
                            setLastUpdate(Date.now())
                        }}>
                        <RefreshRounded />
                    </TableButton>
                    {createItem && (
                        <TableButton
                            onClick={() => {
                                setLoading(true)
                                createItem()
                                    .then(() => setLastUpdate(Date.now()))
                                    .catch((e) => {
                                        setError(e.message)
                                    })
                            }}>
                            <AddRounded />
                        </TableButton>
                    )}
                </div>
                <small>
                    Обновлено: {new Date(lastUpdate).toLocaleTimeString()}
                </small>
            </div>
        </section>
    )
}
