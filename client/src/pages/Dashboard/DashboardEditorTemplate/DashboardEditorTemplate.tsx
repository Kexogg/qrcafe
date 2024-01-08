import { WithId } from '../../../types/types.ts'
import { AxiosResponse } from 'axios'
import styles from './DashboardEditorTemplate.module.css'
import {
    ComponentType,
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
} from 'react'
import { useAppSelector } from '../../../hooks/hooks.ts'
import { TextArea } from '../../../components/UI/Input/TextArea/TextArea.tsx'
import TextField from '../../../components/UI/Input/TextField/TextField.tsx'
import Dropdown from '../../../components/UI/Input/Dropdown/Dropdown.tsx'
import { Button } from '../../../components/UI/Button/Button.tsx'
import { useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'

interface Property {
    name: string
    key: string
    type?:
        | 'text'
        | 'password'
        | 'textarea'
        | 'dropdown'
        | 'checkbox'
        | 'custom'
        | 'number'
    customComponent?: ComponentType<{
        value: unknown
        onChange: (value: unknown) => void
    }>
    options?: string[]
}

type DashboardEditorTemplateProps<T extends WithId> = {
    pageTitle: string
    id?: string
    getItem: (token: string, restaurantId: string, id: string) => Promise<T>
    updateItem: (
        token: string,
        restaurantId: string,
        item: T,
    ) => Promise<AxiosResponse<unknown, unknown>>
    createItem: (
        token: string,
        restaurantId: string,
        item: T,
    ) => Promise<AxiosResponse<unknown, unknown>>
    properties: Property[]
}

export const DashboardEditorTemplate = <T extends WithId>({
    pageTitle,
    getItem,
    updateItem,
    createItem,
    properties,
    id,
}: DashboardEditorTemplateProps<T>) => {
    const [item, setItem] = useState<T>({ id: '' } as T)
    const [itemExists, setItemExists] = useState(id !== undefined)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [lastUpdate, setLastUpdate] = useState(Date.now())
    const session = useAppSelector((state) => state.session)
    const navigate = useNavigate()
    useEffect(() => {
        if (id) {
            getItem(session.token!, session.restaurantId!, id)
                .then((response) => {
                    setItem(response)
                    setItemExists(true)
                })
                .catch((response) => {
                    setError(response.message)
                })
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [getItem, session.restaurantId, session.token, id])
    const onSubmit = () => {
        async function send() {
            return itemExists
                ? await updateItem(session.token!, session.restaurantId!, item)
                : await createItem(session.token!, session.restaurantId!, item)
        }

        setLoading(true)
        send()
            .then(() => {
                setLastUpdate(Date.now())
                setItemExists(true)
                setError('')
            })
            .catch((response) => {
                setError(response.message)
            })
            .finally(() => setLoading(false))
    }

    return (
        <section className={'relative'}>
            {loading && <LoadingSpinner elementOverlay />}
            <h1>{pageTitle}</h1>
            {error}
            <form className={styles.form}>
                {properties.map((property) => {
                    return (
                        <label key={property.name}>
                            {property.name}
                            <PropertyEditor
                                setItem={setItem}
                                item={item}
                                property={property}
                            />
                        </label>
                    )
                })}
                <div className={'col-span-2 flex gap-2'}>
                    <Button dark label={'Сохранить'} onClick={onSubmit} />
                    <Button
                        border
                        label={'Назад'}
                        onClick={() => navigate(-1)}
                    />
                </div>
                <small>
                    Обновлено: {new Date(lastUpdate).toLocaleTimeString()}
                </small>
            </form>
        </section>
    )
}

type PropertyEditorProps<T extends WithId> = {
    setItem: Dispatch<SetStateAction<T>>
    item: WithId
    property: Property
}
const PropertyEditor = <T extends WithId>({
    setItem,
    item,
    property,
}: PropertyEditorProps<T>) => {
    const onChange = (value: unknown) => {
        setItem((item) => ({
            ...item,
            [property.key]: value,
        }))
    }
    switch (property.type) {
        case 'text':
        case 'number':
        case 'password':
            return (
                <TextField
                    type={property.type}
                    dark
                    onChange={(e) => onChange(e.target.value)}
                    defaultValue={(item[property.key] as string) ?? ''}
                />
            )
        case 'textarea':
            return <TextArea value={(item[property.key] as string) ?? ''} />
        case 'dropdown':
            return (
                <Dropdown
                    dark
                    options={property.options ?? []}
                    selected={item[property.key] as string}
                    onChange={(event) => onChange(event.target.value)}
                />
            )
        case 'checkbox':
            //FIXME
            return (
                <input
                    type={'checkbox'}
                    className={'w-min'}
                    checked={(item[property.key] as boolean) ?? false}
                    onChange={(event) => onChange(event.target.checked)}
                />
            )
        case 'custom':
            return (
                property.customComponent && (
                    <property.customComponent
                        value={item[property.key]}
                        onChange={onChange}
                    />
                )
            )
        default:
            return <input type={'text'} />
    }
}
