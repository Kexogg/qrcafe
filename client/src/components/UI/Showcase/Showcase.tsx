import { IDish } from '../../../types/IDish.ts'
import { useState } from 'react'
import DishModal from '../Modal/DishModal.tsx'

type ShowcaseProps = {
    title: string
    items: IDish[]
}

export const Showcase = ({ title, items }: ShowcaseProps) => {
    const [activeItem, setActiveItem] = useState<IDish | null>(null)
    return (
        <section>
            <DishModal item={activeItem} onClose={() => setActiveItem(null)} />
            <h2
                className={
                    'my-5 ml-5 align-middle text-3xl font-bold text-accent-800'
                }>
                {title}
            </h2>
            <ul
                className={
                    'no-scrollbar flex snap-x snap-mandatory gap-3 overflow-y-scroll px-5 py-1'
                }>
                {items.map((item) => (
                    <li key={item.id}>
                        <button
                            onClick={() => setActiveItem(item)}
                            className={
                                'group relative flex h-48 w-48 shrink-0 snap-center justify-end overflow-hidden rounded-3xl shadow'
                            }>
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className={
                                    'absolute h-full w-full object-cover transition-transform group-hover:scale-110'
                                }
                            />
                            <div
                                className={
                                    'relative mb-2 mr-2 mt-auto max-w-[90%] rounded-2xl bg-neutral-400 bg-opacity-30 p-3 text-right font-bold text-gray-200 backdrop-blur-sm'
                                }>
                                {item.name}
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    )
}
