import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'

type TableButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    children: ReactNode
}
export const TableButton = ({ children, ...props }: TableButtonProps) => {
    return (
        <button
            type={'button'}
            {...props}
            className={
                'rounded bg-primary-700 p-1 text-sm text-white transition-colors hover:bg-primary-600 disabled:bg-primary-500'
            }>
            {children}
        </button>
    )
}
