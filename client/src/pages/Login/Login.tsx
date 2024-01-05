import { Button } from '../../components/UI/Button/Button.tsx'
import { useState } from 'react'
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded'
import { useNavigate } from 'react-router-dom'
import Modal from '../../components/UI/Modal/Modal.tsx'

const buttonBoxClass = 'flex flex-col gap-3 mt-auto'

export const Login = () => {
    const navigate = useNavigate()
    const legalSpeak =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    const [modalOpen, setModalOpen] = useState(false)
    return (
        <>
            <QrCodeScannerRoundedIcon
                fontSize={'inherit'}
                style={{ fontSize: 200 }}
                className={'mx-auto'}
            />
            <h1 className={'mx-auto max-w-sm text-xl'}>
                Для совершения заказа отсканируйте QR код на столике
            </h1>
            <div className={buttonBoxClass}>
                <small className={'mt-auto opacity-50'}>
                    <Modal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        title={'Политика конфиденциальности'}>
                        <div className={'my-3 overflow-y-scroll'}>
                            {legalSpeak}
                            <br />
                            {legalSpeak}
                            <br />
                            {legalSpeak}
                            <br />
                            {legalSpeak}
                            <br />
                            {legalSpeak}
                        </div>
                        <Button
                            label={'Закрыть'}
                            dark
                            onClick={() => setModalOpen(false)}
                        />
                    </Modal>
                    Нажав на кнопку, вы даете согласие на обработку персональных
                    данных в соответствии с{' '}
                    <button
                        className={'underline opacity-60'}
                        onClick={() => setModalOpen(true)}>
                        политикой конфиденциальности
                    </button>
                </small>
                <Button
                    label={'Сканировать код'}
                    onClick={() => {
                        navigate('qr')
                    }}
                />
                <Button
                    label={'Ввести код'}
                    dark
                    border
                    onClick={() => {
                        navigate('code')
                    }}
                />
                <Button
                    label={'Войти как сотрудник'}
                    dark
                    border
                    onClick={() => {
                        navigate('employee')
                    }}
                />
            </div>
        </>
    )
}
