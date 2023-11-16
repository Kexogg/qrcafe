//add button component
import React from "react";

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    label: string;
    dark?: boolean;
    border?: boolean;
}
export const Button = ({label, dark, border, ...props}: ButtonProps) => {
    let colorClass: string;
    let borderClass: string;
    if (dark) {
        colorClass = 'bg-primary-700 text-primary-100 disabled:text-primary-400' + (!border ? ' hover:bg-primary-800' : '');
        borderClass = border ? 'border-2 border-primary-200 hover:border-primary-50' : ''
    } else {
        colorClass = 'bg-primary-200 text-primary-800 disabled:text-primary-400' + (!border ? ' hover:bg-primary-50' : '')
        borderClass = border ? 'border-2 border-primary-700 hover:border-primary-800' : ''
    }
    return (
        <button className={`${colorClass} ${borderClass} transition-colors h-10 rounded-3xl justify-center items-center text-center font-semibold`} {...props}>
            {label}
        </button>
    );
};