import { ServedBy } from '../../../components/UI/ServedBy/ServedBy.tsx'
import { Showcase } from '../../../components/UI/Showcase/Showcase.tsx'
import { getPlaceholderDish } from '../../../types/IDish.ts'
import { Catalog } from '../../../components/UI/Catalog/Catalog.tsx'
import { SettingsRounded } from '@mui/icons-material'
import { Link } from 'react-router-dom'

export const CustomerHome = () => {
    const dishes = [
        getPlaceholderDish(),
        getPlaceholderDish(),
        getPlaceholderDish(),
    ]
    return (
        <>
            <section className={'flex justify-between px-5 text-primary-700'}>
                <ServedBy />
                <Link to={'/customer/settings'}>
                    <SettingsRounded />
                </Link>
            </section>
            <Showcase title={'Новинки недели'} items={dishes} />
            <Showcase title={'Мы рекомендуем'} items={dishes} />
            <Catalog title={'Основное меню'} />
        </>
    )
}
