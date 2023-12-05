import {ArrowBackRounded, FavoriteBorderOutlined} from "@mui/icons-material";
import Modal from "./Modal.tsx";
import {getDishTotal, IDish, toggleDishExtra} from "../../../types/IDish.ts";
import {useEffect, useState} from "react";
import {Button} from "../Button/Button.tsx";
import {addToCart} from "../../../features/cart/cartSlice.ts";
import {useAppDispatch} from "../../../hooks.ts";
import {CountInput} from "../CountInput/CountInput.tsx";

type DishModalProps = {
    dish: IDish | null;
    onClose: () => void;
}

const DishModal = ({dish, onClose}: DishModalProps) => {
    const [currentDish, setCurrentDish] = useState<IDish | null>(null);
    useEffect(() => {
        setCurrentDish(dish ? {...dish, count: 1} : null)
    }, [dish]);
    const dispatch = useAppDispatch()
    return (
        <Modal open={!!dish} onClose={onClose}>
            {
                currentDish &&
                <div className={'flex flex-col gap-3 h-full'}>
                    <div className={'relative flex aspect-[3/2] shrink-0'}>
                        <img src={currentDish.image} alt={currentDish.name}
                             className={'absolute w-full aspect-[3/2] object-cover rounded-3xl'}/>
                        <nav className={'relative w-full h-fit flex justify-between p-3'}>
                            <button className={'p-3 bg-white/25 rounded-full backdrop-blur text-white'}
                                    onClick={onClose}>
                                <ArrowBackRounded fontSize={'large'}/>
                            </button>
                            <button className={'p-3 bg-white/25 rounded-full backdrop-blur text-white'}>
                                <FavoriteBorderOutlined fontSize={'large'}/>
                            </button>
                        </nav>
                    </div>
                    <section className={'min-h-0 grow overflow-y-scroll'}>
                        <h1 className={'text-primary-700 text-3xl font-bold'}>{currentDish.name}</h1>
                        <p className={'text-primary-700 text-lg'}>{currentDish.weight}</p>
                        <p className={'text-primary-500 text-lg'}>{currentDish.description}</p>
                    </section>
                    <section className={'flex flex-col mt-auto gap-3 grow-0 justify-end'}>
                        {
                            currentDish.extras.length > 0 &&
                            <>
                                <h2 className={'text-primary-700 text-xl font-medium'}>Добавить</h2>
                                <ul className={'flex gap-3 overflow-y-scroll grow-0 no-scrollbar pb-1'}>
                                    {currentDish.extras.map((extra) => {
                                        return (
                                            <li key={extra.id}>
                                                <button
                                                    className={`whitespace-nowrap border-2 p-2 border-primary-700 rounded-3xl ${extra.applied ? 'bg-primary-700 text-white' : 'text-primary-700'}`}
                                                    onClick={() => {
                                                        setCurrentDish({...currentDish, extras: toggleDishExtra(currentDish, extra.id)})
                                                    }}>
                                                    {extra.name}<br/>+{extra.price}₽
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </>
                        }
                        <div className={'flex items-center'}>
                            <CountInput onCountChange={(count) => setCurrentDish({...currentDish, count: count})} count={currentDish.count ?? 1} />
                            <span className={'text-xl font-bold text-primary-700 ml-auto mr-3'}>Итого:</span>
                            <p className={'rounded-full bg-primary-700 text-white py-2.5 px-4 text-lg font-semibold '}>{getDishTotal(currentDish)}₽</p>
                        </div>
                        <Button label={'Добавить в заказ'} dark onClick={() => {
                            dispatch(addToCart(currentDish));
                            onClose();
                        }}/>
                    </section>
                </div>
            }
        </Modal>
    );
};

export default DishModal;