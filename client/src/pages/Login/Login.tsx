import {Button} from "../../components/UI/Button/Button.tsx";
import {useState} from "react";
import {QrReader} from "react-qr-reader";
import TextField from "../../components/UI/TextField/TextField.tsx";
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import {CodeInputForm} from "../../components/UI/CodeInputForm/CodeInputForm.tsx";
import {Waiter} from "../../types/Waiter.ts";
import {AccountCircle} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import Modal from "../../components/UI/Modal/Modal.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks.ts";
import {setWaiter} from "../../features/waiter/waiterSlice.ts";

enum LOGIN_SCREEN_STATES {
    INITIAL,
    QR_CODE_INPUT,
    CODE_INPUT,
    NAME_INPUT,
    WAITER_INFO,
    DONE
}

const buttonBoxClass = 'flex flex-col gap-3 mt-auto';


interface InitialScreenProps {
    setLoginScreenState: React.Dispatch<React.SetStateAction<LOGIN_SCREEN_STATES>>
}

const InitialScreen = ({setLoginScreenState}: InitialScreenProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const legalSpeak = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

    return (
        <>
            <QrCodeScannerRoundedIcon fontSize={"inherit"} style={{fontSize: 200}} className={'mx-auto'}/>
            <h1 className={'max-w-sm mx-auto text-xl'}>Для совершения заказа отсканируйте QR код на столике</h1>
            <div className={buttonBoxClass}>
                <small className={'opacity-50 mt-auto'}>
                    <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={'Политика конфиденциальности'}>
                        <div className={'overflow-y-scroll my-3'}>
                            {legalSpeak}<br />{legalSpeak}<br />{legalSpeak}<br />{legalSpeak}<br />{legalSpeak}
                        </div>
                        <Button label={'Закрыть'} dark onClick={() => setModalOpen(false)}/>
                    </Modal>
                    Нажав на кнопку, вы даете согласие на обработку персональных данных в соответствии с <button
                    className={'underline opacity-60'} onClick={() => setModalOpen(true)}>политикой конфиденциальности</button>
                </small>
                <Button label={'Сканировать код'} onClick={() => {
                    setLoginScreenState(LOGIN_SCREEN_STATES.QR_CODE_INPUT)
                }}/>
                <Button label={'Ввести код'} dark border onClick={() => {
                    setLoginScreenState(LOGIN_SCREEN_STATES.CODE_INPUT)
                }}/>
            </div>
        </>
    )
}

type CodeInputScreenProps = {
    setLoginScreenState: React.Dispatch<React.SetStateAction<LOGIN_SCREEN_STATES>>,
    verifyCode: (code: string) => boolean,
    setData: React.Dispatch<React.SetStateAction<string>>,
    data: string
}
const QRCodeInputScreen = ({setLoginScreenState, verifyCode, setData, data}: CodeInputScreenProps) => {
    return (<>
            <QrReader className={'max-w-sm w-full mx-auto'} constraints={{facingMode: 'environment'}}
                      onResult={(result, error) => {
                          if (result) {
                              if (verifyCode(result.getText())) {
                                  setLoginScreenState(LOGIN_SCREEN_STATES.NAME_INPUT);
                                  setData(result.getText());
                              } else console.log('Invalid code');
                          }
                          if (error) {
                              console.debug(error);
                          }
                      }}
            />
            <p>{data}</p>
            <div className={'flex flex-col gap-3 mt-auto'}>
                <Button label={'Назад'} dark border onClick={() => {
                    setLoginScreenState(LOGIN_SCREEN_STATES.INITIAL)
                }}/>
                <Button label={'ПРОПУСТИТЬ (DEBUG)'} onClick={() => {
                    setLoginScreenState(LOGIN_SCREEN_STATES.NAME_INPUT)
                }}/>
            </div>
        </>
    )
}

const CodeInputScreen = ({setLoginScreenState, verifyCode, setData, data}: CodeInputScreenProps) => {
    const handleCode = (code: string) => {
        if (verifyCode(code)) {
            //setLoginScreenState(LOGIN_SCREEN_STATES.NAME_INPUT);
            //TODO: add notification about code verification
            setData(code);
        }
    }
    return (
        <form className={'flex h-full flex-col'}>
            <label className={'flex flex-col items-center'}>
                <h1 className={'my-5'}>Введите код столика</h1>
                <CodeInputForm length={6} verifyCode={handleCode}/>
            </label>
            <div className={buttonBoxClass}>
                <Button label={'Продолжить'} disabled={data.length == 0} onClick={() => {
                    setLoginScreenState(LOGIN_SCREEN_STATES.NAME_INPUT)
                }}/>
                <Button label={'Назад'} dark border onClick={() => {
                    setLoginScreenState(LOGIN_SCREEN_STATES.INITIAL)
                }}/>
            </div>
        </form>
    )
}

type NameInputScreenProps = {
    setLoginScreenState: React.Dispatch<React.SetStateAction<LOGIN_SCREEN_STATES>>,
    setName: React.Dispatch<React.SetStateAction<string>>,
    name: string
}
const NameInputScreen = ({setLoginScreenState, setName, name}: NameInputScreenProps) => {
    const verifyName = (name: string): boolean => {
        return !(name.length >= 2 && name.length <= 10 && /^[а-яА-ЯёЁa-zA-Z]+$/.test(name));
    }
    return (
        <form className={'h-full flex flex-col'}>
            <label className={'flex flex-col items-center'}>
                <h1 className={'my-5'}>Как Вас зовут?</h1>
                <TextField placeholder={'Введите имя'} onChange={(e) => setName(e.target.value)}/>
            </label>
            <div className={buttonBoxClass}>
                <Button label={'Продолжить'} disabled={verifyName(name)} onClick={() => {
                    setLoginScreenState(LOGIN_SCREEN_STATES.WAITER_INFO)
                }}/>
                <Button label={'Пропустить'} dark border onClick={() => {
                    setLoginScreenState(LOGIN_SCREEN_STATES.WAITER_INFO)
                }}/>
            </div>
        </form>
    )
}

type WaiterInfoScreenProps = {
    name: string,
    setLoginScreenState: React.Dispatch<React.SetStateAction<LOGIN_SCREEN_STATES>>
}
const WaiterInfoScreen = ({name, setLoginScreenState}: WaiterInfoScreenProps) => {
    const dispatch = useAppDispatch()
    //TODO: remove placeholder
    dispatch(setWaiter(new Waiter('Иванов Иван Иванович', '0001')))
    const waiter = useAppSelector((state) => state.waiter.waiter)
    return (
        <>
            <h1 className={'my-3 text-3xl'}>
                {name ?
                    <>Добро пожаловать, <br/>{name}!</>
                    :
                    <>Добро пожаловать!</>}
            </h1>
            <section className={'flex flex-col justify-center items-center'}>
                <b className={'text-lg'}>Вас обслуживает</b>
                {waiter.image ?
                    <img src={waiter.image} alt={waiter.name}
                         className={'my-5 mx-auto w-auto h-40 object-cover aspect-square rounded-full'}/>
                    :
                    <AccountCircle fontSize={'inherit'} style={{fontSize: 120}} className={'mx-auto my-5'}/>}
                <p className={'col-span-1 text-2xl'}>{waiter.name}</p>
            </section>
            <div className={buttonBoxClass}>
                <Button label={'Продолжить'} onClick={() => setLoginScreenState(LOGIN_SCREEN_STATES.DONE)}/>
            </div>
        </>
    )
}

export const Login = () => {
    const verifyCode = (code: string): boolean => {
        //TODO: add code verification
        console.log('Code verification requested: ' + code)
        return !!code;
    }
    const [loginScreenState, setLoginScreenState] = useState<LOGIN_SCREEN_STATES>(0);
    const [data, setData] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();
    switch (loginScreenState) {
        case LOGIN_SCREEN_STATES.INITIAL:
            return <InitialScreen setLoginScreenState={setLoginScreenState}/>
        case LOGIN_SCREEN_STATES.QR_CODE_INPUT:
            return <QRCodeInputScreen setLoginScreenState={setLoginScreenState} verifyCode={verifyCode}
                                      setData={setData} data={data}/>
        case LOGIN_SCREEN_STATES.CODE_INPUT:
            return <CodeInputScreen setLoginScreenState={setLoginScreenState} verifyCode={verifyCode} setData={setData}
                                    data={data}/>
        case LOGIN_SCREEN_STATES.NAME_INPUT:
            return <NameInputScreen setLoginScreenState={setLoginScreenState} setName={setName} name={name}/>
        case LOGIN_SCREEN_STATES.WAITER_INFO:
            return <WaiterInfoScreen setLoginScreenState={setLoginScreenState} name={name}/>
        case LOGIN_SCREEN_STATES.DONE:
            navigate('/customer/home');
    }
};