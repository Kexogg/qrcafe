import { IDish } from '../../../types/IDish.ts'
import { useAppSelector } from '../../../hooks/hooks.ts'
import { useEffect, useState } from 'react'
import { getFood } from '../../../api/api.ts'
import { AutoTable } from '../../../components/UI/AutoTable/AutoTable.tsx'
import { TableButton } from '../../../components/UI/TableButton/TableButton.tsx'
import { ChevronLeftRounded, ChevronRightRounded } from '@mui/icons-material'
import styles from './CatalogEditorSelector.module.css'

type CatalogEditorSelectorProps = {
    value: IDish[]
    onChange: (v: unknown) => void
}
export const CatalogEditorSelector = ({
    value,
    onChange,
}: CatalogEditorSelectorProps) => {
    const session = useAppSelector((state) => state.session)
    const [items, setItems] = useState<IDish[]>([])
    const [selectedItems1, setSelectedItems1] = useState<IDish[]>([])
    const [selectedItems2, setSelectedItems2] = useState<IDish[]>([])
    const [error, setError] = useState('')
    useEffect(() => {
        getFood(session.token!, session.restaurantId!)
            .then((response) => {
                setItems(response)
            })
            .catch((response) => {
                setError(response.message)
            })
    }, [session.restaurantId, session.token])
    const columns = [
        {
            name: 'Название',
            key: 'name',
        },
        {
            name: 'Цена',
            key: 'price',
            func: (price: string) => `${price} ₽`,
        },
    ]
    return (
        <div className={`${styles.selector}`}>
            <span>Все блюда</span>
            <span className={'col-start-3'}>Блюда категории</span>
            {error}
            <AutoTable
                selected={selectedItems1}
                onSelected={setSelectedItems1}
                columns={columns}
                data={items.filter(
                    (item) => !value.map((v) => v.id).includes(item.id),
                )}
            />
            <div className={'flex flex-col justify-center gap-1'}>
                <TableButton
                    onClick={() => {
                        onChange([...value, ...selectedItems1])
                        setSelectedItems1([])
                    }}>
                    <ChevronRightRounded fontSize={'small'} />
                </TableButton>
                <TableButton
                    onClick={() => {
                        onChange(
                            value.filter(
                                (item) => !selectedItems2.includes(item),
                            ),
                        )
                        setSelectedItems2([])
                    }}>
                    <ChevronLeftRounded fontSize={'small'} />
                </TableButton>
            </div>
            <AutoTable
                selected={selectedItems2}
                onSelected={setSelectedItems2}
                data={value ?? []}
                columns={columns}
            />
        </div>
    )
}
