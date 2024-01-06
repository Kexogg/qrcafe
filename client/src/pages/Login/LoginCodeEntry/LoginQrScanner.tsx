import { useAppDispatch } from '../../../hooks/hooks.ts'
import { QrReader } from 'react-qr-reader'
import { Button } from '../../../components/UI/Button/Button.tsx'
import { setToken } from '../../../features/session/sessionSlice.ts'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const LoginQrScanner = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [data, setData] = useState('Наведите камеру на QR-код на столике')
    const verifyCode = async (code: string) => {
        console.log(code)
        //TODO: verify code
        return true
    }

    return (
        <>
            <QrReader
                className={'mx-auto w-full max-w-sm'}
                constraints={{ facingMode: 'environment' }}
                onResult={(result, err) => {
                    if (result) {
                        verifyCode(result.getText())
                            .then((verified) => {
                                if (verified) {
                                    dispatch(setToken(result.getText()))
                                    setData('Код подтвержден')
                                    navigate('/login/name')
                                } else {
                                    setData(
                                        'Ошибка подтверждения кода, попробуйте еще раз',
                                    )
                                }
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
