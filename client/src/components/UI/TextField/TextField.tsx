import React from 'react';


type TextFieldProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    dark?: boolean;
}

const TextField = ({ dark, ...props}: TextFieldProps) => {
    let colorClass: string;
    if (dark) {
        colorClass = 'border-primary-700 focus:border-primary-800 hover:border-primary-800 text-primary-800';
    } else {
        colorClass = 'border-primary-300 focus:border-primary-200 hover:border-primary-200 text-primary-200';
    }
    return (
        <input {...props} type={"text"} className={`${colorClass} no-ring transition-colors border-b-2 p-2 bg-transparent placeholder-primary-400`}>

        </input>
    );
};

export default TextField;