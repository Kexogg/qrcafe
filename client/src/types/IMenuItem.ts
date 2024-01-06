import { ReactNode } from 'react'

export interface IMenuItem {
    path: string
    name: string
    icon: ReactNode | undefined
}
