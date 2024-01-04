import { StarBorderRounded, StarRounded } from '@mui/icons-material'
import { useState } from 'react'
import { Button } from '../../../components/UI/Button/Button.tsx'
import { CLEAR_STATE } from '../../../store.ts'
import { useAppDispatch } from '../../../hooks.ts'

export const CustomerThankYou = () => {
    const [rating, setRating] = useState(0)
    const dispatch = useAppDispatch()
    return (
        <section className={'flex flex-col gap-5 px-3 text-primary-100'}>
            <h1>Спасибо за заказ!</h1>
            <h2>Пожалуйста, оцените работу приложения</h2>
            <div className={'my-5 flex justify-center gap-3'}>
                {[...Array(5)].map((_, index) => {
                    return (
                        <button
                            className={`rounded-full p-2 ${
                                index < rating
                                    ? 'bg-accent-800 text-accent-100'
                                    : 'bg-primary-600'
                            }`}
                            key={index}
                            onClick={() => setRating(index + 1)}>
                            {index < rating ? (
                                <StarRounded fontSize={'large'} />
                            ) : (
                                <StarBorderRounded fontSize={'large'} />
                            )}
                        </button>
                    )
                })}
            </div>
            <span className={'text-xl'}>
                <Button
                    label={
                        rating === 0 ? 'Выйти без оценки' : 'Отправить и выйти'
                    }
                    onClick={() => {
                        dispatch({ type: CLEAR_STATE })
                    }}
                />
            </span>
        </section>
    )
}
