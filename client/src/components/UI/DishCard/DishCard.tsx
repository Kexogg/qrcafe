import { IDish } from '../../../types/IDish.ts'

type DishCardProps = {
    dish: IDish
    onClick?: () => void
}
const DishCard = ({ dish, onClick }: DishCardProps) => {
    return (
        <li key={dish.id} className={'w-full'}>
            <button
                className={
                    'flex w-full gap-7 rounded-3xl bg-primary-50 p-5 text-left'
                }
                onClick={onClick}>
                <div
                    className={
                        'relative flex h-28 w-28 shrink-0 md:h-40 md:w-40'
                    }>
                    <img
                        className={
                            'absolute aspect-square w-full rounded-3xl object-cover shadow'
                        }
                        src={dish.imageUrl}
                        alt={dish.name}
                    />
                    <p
                        className={
                            'relative mb-2 ml-2 mt-auto w-fit rounded-2xl bg-neutral-400 bg-opacity-30 p-3 text-right font-bold text-gray-200 backdrop-blur-sm'
                        }>
                        {dish.price} ₽
                    </p>
                </div>
                <div className={'flex h-auto flex-col'}>
                    <h3 className={'text-xl font-semibold text-primary-700'}>
                        {dish.name}
                    </h3>
                    <p className={'font-normal text-primary-500 md:text-lg'}>
                        {dish.description}
                    </p>
                    <p
                        className={
                            'mt-auto block font-normal text-primary-700 md:text-lg'
                        }>
                        {dish.weight}
                    </p>
                </div>
            </button>
        </li>
    )
}

export default DishCard
