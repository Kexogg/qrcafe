import { CodeInputForm } from '../../../components/UI/CodeInputForm/CodeInputForm.tsx'
import { Button } from '../../../components/UI/Button/Button.tsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const LoginCodeEntry = () => {
    const buttonBoxClass = 'flex flex-col gap-3 mt-auto'
    const navigate = useNavigate()
    const [data, setData] = useState('')
    const handleCode = (code: string) => {
        //TODO: verify code
        setData(code)
    }
    return (
        <form className={'flex h-full flex-col'}>
            <label className={'flex flex-col items-center'}>
                <h1 className={'my-5'}>Введите код столика</h1>
                <CodeInputForm length={6} verifyCode={handleCode} />
            </label>
            <div className={buttonBoxClass}>
                <Button
                    label={'Продолжить'}
                    disabled={data.length == 0}
                    onClick={() => {
                        navigate('/login/name')
                    }}
                />
                <Button
                    label={'Назад'}
                    dark
                    border
                    onClick={() => {
                        navigate(-1)
                    }}
                />
            </div>
        </form>
    )
}
