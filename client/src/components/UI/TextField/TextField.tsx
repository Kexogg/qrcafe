import React from 'react'

type TextFieldProps = React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
> & {
    dark?: boolean
}

const TextField = ({ dark, ...props }: TextFieldProps) => {
    let colorClass: string
    if (dark) {
        colorClass =
            'border-primary-700 focus:border-primary-800 hover:border-primary-800 text-primary-800'
    } else {
        colorClass =
            'border-primary-300 focus:border-primary-200 hover:border-primary-200 text-primary-200'
    }
    return (
        <input
            type={'text'}
            {...props}
            className={`${colorClass} no-ring h-10 border-b-2 bg-transparent p-2 placeholder-primary-400 transition-colors`}></input>
    )
}

export default TextField
