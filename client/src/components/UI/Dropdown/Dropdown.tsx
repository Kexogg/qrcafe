type DropdownProps = React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
> & {
    options: string[]
    placeholder?: string
    selected?: string
    dark?: boolean
}

const Dropdown = ({
    options,
    selected,
    dark,
    placeholder,
    ...props
}: DropdownProps) => {
    let colorClass: string
    if (dark) {
        colorClass =
            'border-primary-700 focus:border-primary-800 hover:border-primary-800 text-primary-800'
    } else {
        colorClass =
            'border-primary-300 focus:border-primary-200 hover:border-primary-200 text-primary-200'
    }
    return (
        <select
            defaultValue={selected ?? (placeholder && '')}
            {...props}
            className={`${colorClass} no-ring border-b-2 border-primary-300 bg-transparent p-2 text-primary-200 placeholder-primary-400 transition-colors hover:border-primary-200 focus:border-primary-200`}>
            {placeholder && (
                <option value={''} disabled={true}>
                    {placeholder}
                </option>
            )}
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}

export default Dropdown
