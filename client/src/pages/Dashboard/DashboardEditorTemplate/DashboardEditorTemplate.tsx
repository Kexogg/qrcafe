import { WithId } from '../../../types/types.ts'
import { AxiosError, AxiosResponse } from 'axios'
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
import { useLocation, useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'
import { ErrorBox } from '../../../components/UI/ErrorBox/ErrorBox.tsx'

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
        | 'image'
    customComponent?: ComponentType<{
        value: unknown
        onChange: (value: unknown) => void
    }>
    options?: string[] | { name: string; value: string }[]
    fetchOptions?: (
        token: string,
        restaurantId: string,
    ) => Promise<
        {
            name: string
            value: string
        }[]
    >
    defaultValue?: (value?: unknown, options?: string) => string
    required?: boolean
    requiresItem?: boolean
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
    const [itemExists, setItemExists] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | Error | AxiosError>('')
    const [lastUpdate, setLastUpdate] = useState(Date.now())
    const session = useAppSelector((state) => state.session)
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        if (id) {
            getItem(session.token!, session.restaurantId!, id)
                .then((response) => {
                    setItem(response)
                    setItemExists(true)
                })
                .catch((response) => {
                    setError(response)
                })
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [getItem, session.restaurantId, session.token, id])
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        async function send() {
            return itemExists
                ? await updateItem(session.token!, session.restaurantId!, item)
                : await createItem(session.token!, session.restaurantId!, item)
        }

        setLoading(true)
        send()
            .then((response) => {
                setLastUpdate(Date.now())
                console.log(response)
                setError('')
                const data = (response.data as T) ?? response
                if (data && response.status !== 204) {
                    if (!itemExists) navigate(`${data.id}`)
                    else setItem(data)
                }
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
            {error && <ErrorBox error={error} />}
            <form
                onSubmit={onSubmit}
                className={`${styles.form} ${
                    loading && 'animate-pulse opacity-75'
                }`}>
                {properties.map((property) => {
                    if (property.requiresItem && !itemExists) return null
                    return (
                        <label key={property.name}>
                            <span>{property.name}</span>
                            <PropertyEditor
                                setItem={setItem}
                                item={item}
                                property={property}
                            />
                        </label>
                    )
                })}
                <div className={'col-span-2 flex gap-2'}>
                    <Button dark label={'Сохранить'} type={'submit'} />
                    <Button
                        border
                        label={'Назад'}
                        onClick={() => {
                            const pathSegments = location.pathname.split('/')
                            if (
                                pathSegments[pathSegments.length - 2] === 'edit'
                            ) {
                                pathSegments.pop()
                            }
                            pathSegments.pop()
                            const newPath = pathSegments.join('/')
                            navigate(newPath)
                        }}
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
    const session = useAppSelector((state) => state.session)
    const onChange = (value: unknown) => {
        setItem((item) => ({
            ...item,
            [property.key]: value,
        }))
    }
    const [options, setOptions] = useState<
        { name: string; value: string }[] | string[]
    >(property.options ?? [])
    useEffect(() => {
        if (property.fetchOptions) {
            property
                .fetchOptions(session.token!, session.restaurantId!)
                .then((options) => setOptions(options))
        }
    }, [property, session.restaurantId, session.token])

    switch (property.type) {
        case 'text':
        case 'number':
        case 'password':
            return (
                <TextField
                    type={property.type}
                    required={property.required}
                    dark
                    onChange={(e) => onChange(e.target.value)}
                    defaultValue={(item[property.key] as string) ?? ''}
                />
            )
        case 'textarea':
            return (
                <TextArea
                    required={property.required}
                    value={(item[property.key] as string) ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                />
            )
        case 'dropdown':
            return (
                <Dropdown
                    dark
                    required={property.required}
                    options={options}
                    selected={
                        property.defaultValue?.() ??
                        (item[property.key] as string)
                    }
                    onChange={(event) => onChange(event.target.value)}
                />
            )
        case 'checkbox':
            return (
                <input
                    type={'checkbox'}
                    required={property.required}
                    className={'w-min'}
                    checked={(item[property.key] as boolean) ?? false}
                    onChange={(event) => onChange(event.target.checked)}
                />
            )
        case 'image':
            return (
                <div className={'flex flex-col gap-3'}>
                    {item[property.key] !== '' &&
                        item[property.key] !== undefined && (
                            <img
                                src={
                                    item[property.key] instanceof File
                                        ? URL.createObjectURL(
                                              item[property.key] as Blob,
                                          )
                                        : (item[property.key] as string) +
                                          `?${Date.now()}` // Add timestamp to prevent caching
                                }
                                className={'h-40 w-40 object-cover'}
                                alt={item[property.key] as string}
                            />
                        )}
                    <input
                        type={'file'}
                        accept="image/jpeg"
                        required={property.required}
                        className={'w-min'}
                        onChange={(event) =>
                            onChange(event.target.files?.item(0))
                        }
                    />
                </div>
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
            return <>{item[property.key]}</>
    }
}
