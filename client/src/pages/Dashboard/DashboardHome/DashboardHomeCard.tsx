type DashboardHomeCardProps = {
    title: string
    value: string
    icon?: React.ReactNode
}

export const DashboardHomeCard = ({
    title,
    value,
    icon,
}: DashboardHomeCardProps) => {
    return (
        <li
            className={
                'block rounded-3xl bg-primary-50 p-5 text-primary-700 transition-colors hover:bg-white'
            }>
            <div className={'text-6xl font-bold'}>{value}</div>
            <div className={'text-right'}>{title}</div>
        </li>
    )
}
