import {Button} from "../../components/UI/Button/Button.tsx";
import { useState} from "react";
import {QrReader} from "react-qr-reader";
import TextField from "../../components/UI/TextField/TextField.tsx";
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import {CodeInputForm} from "../../components/UI/CodeInputForm/CodeInputForm.tsx";

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
    return (
        <>
            <QrCodeScannerRoundedIcon fontSize={"inherit"} style={{fontSize: 200}} className={'mx-auto'}/>
            <h1 className={'max-w-sm mx-auto'}>Для совершения заказа отсканируйте QR код на столике</h1>
            <div className={buttonBoxClass}>
                <Button label={'Сканировать код'} onClick={() => {
                    setLoginScreenState(LOGIN_SCREEN_STATES.QR_CODE_INPUT)
                }}/>
                <Button label={'Ввести код'} dark={true} border={true} onClick={() => {
                    setLoginScreenState(LOGIN_SCREEN_STATES.CODE_INPUT)
                }}/>
            </div>
        </>
    )
}

type QRCodeInputScreenProps = {
    setLoginScreenState: React.Dispatch<React.SetStateAction<LOGIN_SCREEN_STATES>>,
    verifyCode: (code: string) => boolean,
    setData: React.Dispatch<React.SetStateAction<string>>,
    data: string
}
const QRCodeInputScreen = ({ setLoginScreenState, verifyCode, setData, data }: QRCodeInputScreenProps) => {
    return (<>
            <QrReader constraints={{facingMode: 'environment'}}
                      onResult={(result, error) => {
                          if (result) {
                              // @ts-ignore
                              if (verifyCode(result.text)) {
                                  setLoginScreenState(LOGIN_SCREEN_STATES.NAME_INPUT);
                                  // @ts-ignore
                                  setData(result.text);
                              } else console.log('Invalid code');
                          }
                          if (error) {
                              console.info(error);
                          }
                      }} className={'max-w-[50vh] w-full mx-auto'}
            />
            <p>{data}</p>
            <div className={'flex flex-col gap-3 mt-auto'}>
                <Button label={'Назад'} dark border onClick={() => {
                    setLoginScreenState(LOGIN_SCREEN_STATES.INITIAL)
                }}/>
                <Button label={'ПРОПУСТИТЬ (DEBUG)'} border onClick={() => {
                    setLoginScreenState(LOGIN_SCREEN_STATES.NAME_INPUT)
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

const CodeInputScreen = ({ setLoginScreenState, verifyCode, setData, data }: CodeInputScreenProps) => {
    return (
        <>
            <label className={'flex flex-col items-center mt-[25%]'}>
                <h1>Введите код столика</h1>
                <CodeInputForm length={6} verifyCode={verifyCode}/>
            </label>
            <div className={buttonBoxClass}>
                <Button label={'Продолжить'} border disabled={data.length == 0} onClick={() => {
                    //TODO: set data
                    setData('123456');
                    setLoginScreenState(LOGIN_SCREEN_STATES.NAME_INPUT)
                }}/>
                <Button label={'Назад'} dark border onClick={() => {
                    setLoginScreenState(LOGIN_SCREEN_STATES.INITIAL)
                }}/>
            </div>
        </>
    )
}

type NameInputScreenProps = {
    setLoginScreenState: React.Dispatch<React.SetStateAction<LOGIN_SCREEN_STATES>>,
    setName: React.Dispatch<React.SetStateAction<string>>,
    name: string
}
const NameInputScreen = ({ setLoginScreenState, setName, name }: NameInputScreenProps) => {
    return (
        <>
            <label className={'flex flex-col items-center mt-[25%]'}>
                <h1>Как Вас зовут?</h1>
                <TextField placeholder={'Введите имя'} onChange={(e) => setName(e.target.value)}/>
            </label>
            <div className={buttonBoxClass}>
                <Button label={'Продолжить'} border disabled={name.length == 0} onClick={() => {
                    setLoginScreenState(LOGIN_SCREEN_STATES.WAITER_INFO)
                }}/>
                <Button label={'Пропустить'} dark border onClick={() => {
                    setLoginScreenState(LOGIN_SCREEN_STATES.WAITER_INFO)
                }}/>
            </div>
        </>
    )
}

type WaiterInfoScreenProps = {
    setLoginScreenState: React.Dispatch<React.SetStateAction<LOGIN_SCREEN_STATES>>,
    name: string
}
const WaiterInfoScreen = ({ setLoginScreenState, name }: WaiterInfoScreenProps) => {
    return (
        <>
            <h1>
                Здравствуйте, {name}!
            </h1>
            Вас обслуживает <b>Иванов Иван Иванович</b>
            <div className={buttonBoxClass}>
                <Button label={'Продолжить'} border onClick={() => {
                    setLoginScreenState(LOGIN_SCREEN_STATES.DONE)
                }}/>
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

    switch (loginScreenState) {
        case LOGIN_SCREEN_STATES.INITIAL:
            return <InitialScreen setLoginScreenState={setLoginScreenState}/>
        case LOGIN_SCREEN_STATES.QR_CODE_INPUT:
            return <QRCodeInputScreen setLoginScreenState={setLoginScreenState} verifyCode={verifyCode} setData={setData} data={data}/>
        case LOGIN_SCREEN_STATES.CODE_INPUT:
            return <CodeInputScreen setLoginScreenState={setLoginScreenState} verifyCode={verifyCode} setData={setData} data={data}/>
        case LOGIN_SCREEN_STATES.NAME_INPUT:
            //TODO: add name verification
            return <NameInputScreen setLoginScreenState={setLoginScreenState} setName={setName} name={name}/>
        case LOGIN_SCREEN_STATES.WAITER_INFO:
            //TODO: add waiter picture
            return <WaiterInfoScreen setLoginScreenState={setLoginScreenState} name={name}/>
    }
};