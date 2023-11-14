import {Button} from "../../components/UI/Button/Button.tsx";
import { useState} from "react";
import {QrReader} from "react-qr-reader";
import TextField from "../../components/UI/TextField/TextField.tsx";
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';

enum LoginScreenState {
    INITIAL,
    QR_CODE_INPUT,
    CODE_INPUT,
    NAME_INPUT,
    WAITER_INFO,
    DONE
}

export const Login = () => {
    const buttonBoxClass = 'flex flex-col gap-3 mt-auto';
    const verifyCode = (code: string) => {
        //TODO: add code verification
        if (code) return true;
    }
    const [loginScreenState, setLoginScreenState] = useState<LoginScreenState>(0);
    const [data, setData] = useState('');
    const [name, setName] = useState('');

    switch (loginScreenState) {
        case LoginScreenState.INITIAL:
            return (
                <>
                    <QrCodeScannerRoundedIcon fontSize={"inherit"} style={{fontSize: 200}} className={'mx-auto'}/>
                    <h1 className={'max-w-sm mx-auto'}>Для совершения заказа отсканируйте QR код на столике</h1>
                    <div className={buttonBoxClass}>
                        <Button label={'Сканировать код'} onClick={() => {
                            setLoginScreenState(LoginScreenState.QR_CODE_INPUT)
                        }}/>
                        <Button label={'Ввести код'} dark={true} border={true} onClick={() => {
                            setLoginScreenState(LoginScreenState.CODE_INPUT)
                        }}/>
                    </div>
                </>
            )
        case LoginScreenState.QR_CODE_INPUT:
            return (<>
                    <QrReader constraints={{facingMode: 'environment'}}
                              onResult={(result, error) => {
                                  if (result) {
                                      if (verifyCode(result.text)) {
                                          setLoginScreenState(LoginScreenState.NAME_INPUT);
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
                            setLoginScreenState(LoginScreenState.INITIAL)
                        }}/>
                        <Button label={'ПРОПУСТИТЬ (DEBUG)'} border onClick={() => {
                            setLoginScreenState(LoginScreenState.NAME_INPUT)
                        }}/>
                    </div>
                </>
            )
        case LoginScreenState.CODE_INPUT:
            //TODO: add code verification & replace input
            return (
                <>
                    <label className={'flex flex-col items-center mt-[25%]'}>
                        <h1>Введите код столика</h1>
                        <TextField placeholder={'Введите код'} onChange={(e) => setData(e.target.value)}/>
                    </label>
                    <div className={buttonBoxClass}>
                        <Button label={'Продолжить'} border disabled={data.length == 0} onClick={() => {
                            setLoginScreenState(LoginScreenState.NAME_INPUT)
                        }}/>
                        <Button label={'Назад'} dark border onClick={() => {
                            setLoginScreenState(LoginScreenState.INITIAL)
                        }}/>
                    </div>
                </>
            )
        case LoginScreenState.NAME_INPUT:
            //TODO: add name verification
            return (
                <>
                    <label className={'flex flex-col items-center mt-[25%]'}>
                        <h1>Как Вас зовут?</h1>
                        <TextField placeholder={'Введите имя'} onChange={(e) => setName(e.target.value)}/>
                    </label>
                    <div className={buttonBoxClass}>
                        <Button label={'Продолжить'} border disabled={name.length == 0} onClick={() => {
                            setLoginScreenState(LoginScreenState.WAITER_INFO)
                        }}/>
                        <Button label={'Пропустить'} dark border onClick={() => {
                            setLoginScreenState(LoginScreenState.WAITER_INFO)
                        }}/>
                    </div>
                </>
            )
        case LoginScreenState.WAITER_INFO:
            //TODO: add waiter picture
            return (
                <>
                    <h1>
                        Здравствуйте, {name}!
                    </h1>
                    Вас обслуживает <b>Иванов Иван Иванович</b>
                    <div className={buttonBoxClass}>
                        <Button label={'Продолжить'} border onClick={() => {
                            setLoginScreenState(LoginScreenState.DONE)
                        }}/>
                    </div>
                </>
            )
    }
};