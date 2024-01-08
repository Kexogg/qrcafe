import TextField from '../../../components/UI/Input/TextField/TextField.tsx'
import Dropdown from '../../../components/UI/Input/Dropdown/Dropdown.tsx'
import { Button } from '../../../components/UI/Button/Button.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import { useState } from 'react'
import { useAppSelector } from '../../../hooks/hooks.ts'
import { createEmployee } from '../../../api/api.ts'
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner/LoadingSpinner.tsx'

type CreateEmployeeModalProps = {
    open: boolean
    onClose: () => void
}
export const CreateEmployeeModal = ({
    open,
    onClose,
}: CreateEmployeeModalProps) => {
    const [name, setName] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const session = useAppSelector((state) => state.session)
    const sendData = () => {
        setLoading(true)
        console.log(role)
        createEmployee(
            session.token as string,
            session.restaurantId as string,
            name,
            login,
            password,
            role,
        )
            .then(onClose)
            .catch((response) => {
                setError(response.message)
            })
            .finally(() => setLoading(false))
    }
    return (
        <Modal
            open={open}
            onClose={onClose}
            autoHeight
            title={'Добавить сотрудника'}>
            {loading && <LoadingSpinner screenOverlay />}

            <TextField
                dark
                placeholder={'ФИО'}
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                dark
                placeholder={'Логин'}
                onChange={(e) => setLogin(e.target.value)}
            />
            <TextField
                type={'password'}
                dark
                placeholder={'Пароль'}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Dropdown
                dark
                placeholder={'Роль'}
                options={['0', '1']}
                onChange={(e) => setRole(e.target.value)}
            />

            {error}
            <Button
                label={'Добавить'}
                onClick={sendData}
                dark
                disabled={
                    name.length === 0 ||
                    login.length === 0 ||
                    password.length === 0 ||
                    role.length === 0
                }
            />
            <Button label={'Отмена'} border onClick={onClose} />
        </Modal>
    )
}
