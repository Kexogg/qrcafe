import { useAppDispatch } from '../../../hooks/hooks.ts'
import { QrReader } from 'react-qr-reader'
import { Button } from '../../../components/UI/Button/Button.tsx'
import { setToken } from '../../../features/session/sessionSlice.ts'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClientToken } from '../../../api/api.ts'

export const LoginQrScanner = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [data, setData] = useState('Наведите камеру на QR-код на столике')
    const getParams = async (result: string) => {
        const params = new URLSearchParams(new URL(result).search)
        const id = params.get('id')
        const table = params.get('table')
        if (id && table) {
            return { id, table }
        }
        throw new Error('Неверный QR-код')
    }

    return (
        <>
            <QrReader
                className={'mx-auto w-full max-w-sm'}
                constraints={{ facingMode: 'environment' }}
                onResult={(result, err) => {
                    if (result) {
                        getParams(result.getText())
                            .then((params) => {
                                getClientToken(params.id, params.table)
                                    .then((response) => {
                                        dispatch(
                                            setToken(
                                                response.data.access_token,
                                            ),
                                        )
                                        setData('Код подтвержден')
                                        navigate('/login/name')
                                    })
                                    .catch((err) => {
                                        if (err.response?.status)
                                            setData(
                                                `Ошибка авторизации, код ${err.response.status}`,
                                            )
                                        else
                                            setData(
                                                'Ошибка подключения к серверу',
                                            )
                                        console.debug(err)
                                    })
                            })
                            .catch((err) => {
                                console.debug(err)
                            })
                    } else if (err?.name !== 'e2') {
                        setData(
                            'Ошибка сканирования QR-кода, попробуйте еще раз',
                        )
                        console.debug(err)
                    }
                }}
            />
            <p>{data}</p>
            <div className={'mt-auto flex flex-col gap-3'}>
                <Button
                    label={'Назад'}
                    dark
                    border
                    onClick={() => {
                        navigate(-1)
                    }}
                />
                {import.meta.env.MODE === 'development' && (
                    <Button
                        label={'Пропустить (DEBUG)'}
                        onClick={() => {
                            dispatch(setToken('debug'))
                        }}
                    />
                )}
            </div>
        </>
    )
}
