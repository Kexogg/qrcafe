//add button component
import React from "react";

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    label: string;
    dark?: boolean;
    border?: boolean;
}
export const Button = ({label, dark, border, ...props}: ButtonProps) => {
    let colorClass: string;
    if (!dark) {
        colorClass = 'bg-primary-200 text-primary-800 disabled:text-primary-400';
    } else {
        colorClass = 'bg-primary-700 text-primary-100 disabled:text-primary-400';
    }
    const borderClass = border ? 'border-2 border-primary-200' : ''
    return (
        <button className={`${colorClass} ${borderClass} p-2 rounded-3xl justify-center items-center text-center font-semibold`} {...props}>
            {label}
        </button>
    );
};