import { ReactNode } from 'react'

type DashboardHomeCardProps = {
    title: string
    value: string
    icon?: ReactNode
}

export const DashboardHomeCard = ({
    title,
    value,
    icon,
}: DashboardHomeCardProps) => {
    return (
        <li
            className={
                'flex h-full flex-col rounded-3xl bg-primary-50 p-5 text-primary-700 transition-colors hover:bg-white'
            }>
            <div className={'ml-auto w-fit'}>{icon}</div>
            <div className={'mt-auto w-fit text-6xl font-bold'}>{value}</div>
            <div className={'text-right'}>{title}</div>
        </li>
    )
}
