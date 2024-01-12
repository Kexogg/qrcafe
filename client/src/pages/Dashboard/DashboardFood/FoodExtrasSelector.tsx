import { AutoTable } from '../../../components/UI/AutoTable/AutoTable.tsx'
import { AddRounded, DeleteRounded } from '@mui/icons-material'
import { TableButton } from '../../../components/UI/TableButton/TableButton.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import { useState } from 'react'
import TextField from '../../../components/UI/Input/TextField/TextField.tsx'
import { Button } from '../../../components/UI/Button/Button.tsx'

type FoodExtraSelectorProps = {
    value: { name: string; price: number; id: number }[]
    onChange: (v: unknown) => void
}

export const FoodExtrasSelector = ({
    value,
    onChange,
}: FoodExtraSelectorProps) => {
    const [open, setOpen] = useState(false)
    const [current, setCurrent] = useState<{ name: string; price: number }>({
        name: '',
        price: 0,
    })
    return (
        <div>
            <Modal open={open} onClose={() => setOpen(false)} autoHeight>
                <h1>Добавление добавки</h1>
                <TextField
                    onChange={(e) =>
                        setCurrent((c) => ({ ...c, name: e.target.value }))
                    }
                    dark
                    placeholder={'Название'}
                />
                <TextField
                    onChange={(e) =>
                        setCurrent((c) => ({
                            ...c,
                            price: Number(e.target.value),
                        }))
                    }
                    dark
                    placeholder={'Цена'}
                    type={'number'}
                />
                <Button
                    disabled={current.name == '' || current.price <= 0}
                    onClick={() => {
                        onChange([
                            ...value,
                            {
                                name: current.name,
                                price: current.price,
                                id: Date.now(),
                            },
                        ])
                        setCurrent({ name: '', price: 0 })
                        setOpen(false)
                    }}
                    label={'Добавить'}
                    dark
                />
                <Button
                    label={'Отмена'}
                    border
                    onClick={() => setOpen(false)}
                />
            </Modal>
            <AutoTable
                data={value.map((v) => ({ ...v, id: v.id.toString() }))}
                columns={[
                    {
                        name: 'Название',
                        key: 'name',
                    },
                    {
                        name: 'Цена',
                        key: 'price',
                        func: (price: string) => `${price} ₽`,
                    },
                ]}
                customButtons={[
                    {
                        icon: <DeleteRounded fontSize={'small'} />,
                        onClick: (row) => {
                            onChange(value.filter((v) => v.name !== row.name))
                        },
                    },
                ]}
            />
            <TableButton onClick={() => setOpen(true)}>
                <AddRounded fontSize={'small'} />
            </TableButton>
        </div>
    )
}