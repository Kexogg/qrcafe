import { ReactNode } from 'react'

type TableButtonProps = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    children: ReactNode
}
export const TableButton = ({ children, ...props }: TableButtonProps) => {
    return (
        <button
            {...props}
            className={
                'rounded bg-primary-700 p-1 text-sm text-white transition-colors hover:bg-primary-600 disabled:bg-primary-500'
            }>
            {children}
        </button>
    )
}
