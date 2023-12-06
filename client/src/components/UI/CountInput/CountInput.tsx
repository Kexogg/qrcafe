import { AddRounded, RemoveRounded } from '@mui/icons-material'
import { useState } from 'react'

type CountInputProps = {
    onCountChange: (count: number) => void
    min?: number
    max?: number
    count: number
    disabled?: boolean
}

export const CountInput = ({
    onCountChange,
    min,
    max,
    count,
    disabled,
}: CountInputProps) => {
    const [currentCount, setCurrentCount] = useState(count)

    return (
        <div className={'flex h-full items-center'}>
            <button
                disabled={count <= (min ?? 1) || disabled}
                onClick={() => {
                    onCountChange(count - 1)
                    setCurrentCount(count - 1)
                }}
                className={`aspect-square h-full rounded-full bg-primary-700 p-2 text-white disabled:bg-primary-400`}>
                <RemoveRounded />
            </button>
            <span
                className={
                    'mx-3 text-center text-xl font-semibold text-primary-700'
                }>
                {currentCount}
            </span>
            <button
                disabled={count >= (max ?? 20) || disabled}
                onClick={() => {
                    onCountChange(count + 1)
                    setCurrentCount(count + 1)
                }}
                className={`aspect-square h-full rounded-full bg-primary-700 p-2 text-white disabled:bg-primary-400`}>
                <AddRounded />
            </button>
        </div>
    )
}
