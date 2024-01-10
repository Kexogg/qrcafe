import { Catalog } from '../../../components/UI/Catalog/Catalog.tsx'
import { useAppSelector } from '../../../hooks/hooks.ts'
import { useEffect, useState } from 'react'
import { ICategory } from '../../../types/ICategory.ts'
import { getCatalog } from '../../../api/api.ts'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'

export const WaiterCatalog = () => {
    const session = useAppSelector((state) => state.session)
    const [catalog, setCatalog] = useState<ICategory[]>([])
    useEffect(() => {
        getCatalog(session.token!, session.restaurantId!).then((catalog) => {
            setCatalog(catalog)
            console.log(catalog)
        })
    }, [session.restaurantId, session.token])
    if (catalog.length === 0) {
        return <LoadingSpinner screenOverlay />
    }
    return (
        <section>
            <Catalog categories={catalog} title={'Меню'} />
        </section>
    )
}
