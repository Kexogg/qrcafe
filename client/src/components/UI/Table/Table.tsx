import { DetailedHTMLProps, ReactNode, SelectHTMLAttributes } from 'react'
import styles from './Table.module.css'
type TableProps = DetailedHTMLProps<
    SelectHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
> & {
    children: ReactNode
}
export const Table = ({ children, ...props }: TableProps) => {
    return (
        <div
            className={
                'h-full w-full overflow-hidden rounded-xl border-2 border-primary-700 bg-primary-50'
            }>
            <table {...props} className={styles.table}>
                {children}
            </table>
        </div>
    )
}
