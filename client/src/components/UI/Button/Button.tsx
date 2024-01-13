import { Link } from 'react-router-dom'
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

type ButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    label: string
    dark?: boolean
    border?: boolean
    href?: string
}
export const Button = ({ label, dark, border, ...props }: ButtonProps) => {
    const classes =
        'shrink-0 transition-colors h-10 rounded-3xl justify-center items-center text-center font-semibold px-3'
    let colorClass: string
    let borderClass: string
    if (dark) {
        colorClass =
            'bg-primary-700 disabled:bg-primary-700 disabled:active:bg-accent-700 text-primary-100 disabled:text-primary-400' +
            (!border ? ' hover:bg-primary-800' : '')
        borderClass = border
            ? 'border-2 border-primary-200 hover:border-primary-50'
            : ''
    } else {
        colorClass =
            'bg-primary-200 disabled:hover:bg-primary-200 disabled:active:bg-accent-200 text-primary-800 disabled:text-primary-400' +
            (!border ? ' hover:bg-primary-50' : '')
        borderClass = border
            ? 'border-2 border-primary-700 hover:border-primary-800'
            : ''
    }
    if (props.href) {
        return (
            <Link to={props.href} className={'flex flex-col'}>
                <button
                    type={'button'}
                    {...props}
                    className={`${colorClass} ${borderClass} ${classes}`}>
                    {label}
                </button>
            </Link>
        )
    }
    return (
        <button
            type={'button'}
            className={`${colorClass} ${borderClass} ${classes}`}
            {...props}>
            {label}
        </button>
    )
}
