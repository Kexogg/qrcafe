import { DetailedHTMLProps, TextareaHTMLAttributes } from 'react'

type TextAreaProps = DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
>

export const TextArea = ({ ...props }: TextAreaProps) => {
    return (
        <textarea
            {...props}
            className={`w-auto min-w-[12rem] rounded-xl border-2 border-primary-700 bg-primary-50 p-1`}></textarea>
    )
}
