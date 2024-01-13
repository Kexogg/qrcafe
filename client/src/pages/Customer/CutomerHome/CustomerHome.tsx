import { ServedBy } from '../../../components/UI/ServedBy/ServedBy.tsx'
import { Showcase } from '../../../components/UI/Showcase/Showcase.tsx'
import { Catalog } from '../../../components/UI/Catalog/Catalog.tsx'
import { SettingsRounded } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCatalog } from '../../../api/api.ts'
import { useAppSelector } from '../../../hooks/hooks.ts'
import { ICategory } from '../../../types/ICategory.ts'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'

export const CustomerHome = () => {
    const session = useAppSelector((state) => state.session)
    const [catalog, setCatalog] = useState<ICategory[] | null>(null)
    useEffect(() => {
        getCatalog(session.token!, session.restaurantId!).then(
            (catalog: ICategory[]) => {
                setCatalog(
                    catalog
                        .map((category) => {
                            category.foodList = category.foodList.filter(
                                (dish) => dish.available,
                            )
                            return category
                        })
                        .filter((category) => category.foodList.length > 0),
                )
            },
        )
    }, [session.restaurantId, session.token])
    if (!catalog) {
        return <LoadingSpinner screenOverlay />
    }
    return (
        <>
            <section className={'flex justify-between px-5 text-primary-700'}>
                <ServedBy />
                <Link to={'/customer/settings'}>
                    <SettingsRounded />
                </Link>
            </section>
            {catalog
                .filter((category) => category.separate)
                .map((category) => (
                    <Showcase
                        key={category.id}
                        title={category.name}
                        items={category.foodList}
                    />
                ))}

            <Catalog
                title={'Основное меню'}
                categories={catalog.filter((category) => !category.separate)}
            />
        </>
    )
}
