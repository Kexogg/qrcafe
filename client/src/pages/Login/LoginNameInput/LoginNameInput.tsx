import TextField from '../../../components/UI/Input/TextField/TextField.tsx'
import { Button } from '../../../components/UI/Button/Button.tsx'
import { useState } from 'react'
import { useAppDispatch } from '../../../hooks/hooks.ts'
import { useNavigate } from 'react-router-dom'
import { setCustomer } from '../../../features/customer/customerSlice.ts'

export const LoginNameInput = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const verifyName = (name: string): boolean => {
        return !(
            name.length >= 2 &&
            name.length <= 10 &&
            /^[а-яА-ЯёЁa-zA-Z]+$/.test(name)
        )
    }
    return (
        <form className={'flex h-full flex-col'}>
            <label className={'flex flex-col items-center'}>
                <h1 className={'my-5'}>Как Вас зовут?</h1>
                <TextField
                    placeholder={'Введите имя'}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            <div className={'mt-auto flex flex-col gap-3'}>
                <Button
                    label={'Продолжить'}
                    disabled={verifyName(name)}
                    onClick={() => {
                        dispatch(setCustomer({ name: name }))
                        navigate('/login/welcome')
                    }}
                />
                <Button
                    label={'Пропустить'}
                    dark
                    border
                    onClick={() => {
                        navigate('/login/welcome')
                    }}
                />
            </div>
        </form>
    )
}
