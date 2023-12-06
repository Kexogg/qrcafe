import {AccountCircle} from "@mui/icons-material";
import {useAppSelector} from "../../../hooks.ts";

export const ServedBy = () => {

    const waiter = useAppSelector((state) => state.waiter.waiter)
    return (
        waiter &&
        <section className={'flex gap-5 px-5'}>
            {waiter.image
                ? <img src={waiter.image} alt={waiter.name} className={'w-12 h-12 rounded-full'}/>
                : <AccountCircle fontSize={'inherit'} style={{fontSize: 48}} />}
            <div>
                Вас обслуживает:<br />
                <b>{waiter.name}</b>
            </div>
        </section>
    );
};