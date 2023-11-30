import {AddRounded, ArrowBackRounded, FavoriteBorderOutlined, RemoveRounded} from "@mui/icons-material";
import Modal from "./Modal.tsx";
import {Dish} from "../../../types/Dish.ts";
import {useEffect, useState} from "react";
import {Button} from "../Button/Button.tsx";

type DishModalProps = {
    dish: Dish | null;
    onClose: () => void;
}

const DishModal = ({dish, onClose}: DishModalProps) => {
    const [count, setCount] = useState(1);
    const [extras, setExtras] = useState(dish?.extras || [])
    useEffect(() => {
        setExtras(dish?.extras || [])
    }, [dish]);
    return (
        <Modal open={!!dish} onClose={onClose}>
            {
                dish &&
                <div className={'flex flex-col gap-3 h-full'}>
                    <div className={'relative flex aspect-[3/2] shrink-0'}>
                        <img src={dish.image} alt={dish.name}
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
                    <h1 className={'text-primary-700 text-3xl font-bold'}>{dish.name}</h1>
                    <p className={'text-primary-700 text-xl'}>{dish.weight}</p>
                    <p className={'text-primary-500 text-xl'}>{dish.description}</p>
                    <div className={'flex flex-col mt-auto gap-3 grow-0 justify-end'}>
                        {
                            dish.extras.length > 0 &&
                            <>
                                <h2 className={'text-primary-700 text-xl font-medium'}>Добавить</h2>
                                <ul className={'flex gap-3'}>
                                    {extras.map((extra) => {
                                        return (
                                            <li key={extra.id}>
                                                <button
                                                    className={`border-2 p-2.5 border-primary-700 rounded-3xl ${extra.applied ? 'bg-primary-700 text-white' : 'text-primary-700'}`}
                                                    onClick={() => {
                                                        setExtras(extras.map((e) => {
                                                            if (e.id == extra.id) {
                                                                e.applied = !e.applied
                                                            }
                                                            return e
                                                        }))
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
                            <div className={'flex items-center'}>
                                <button
                                    className={`${count == 1 ? 'bg-primary-400' : 'bg-primary-700'} text-white p-3 rounded-full aspect-square`}
                                    onClick={() => setCount(Math.max(count - 1, 1))}>
                                    <RemoveRounded/>
                                </button>
                                <span
                                    className={'font-semibold text-xl text-primary-700 mx-3 w-3 text-center'}>{count}</span>
                                <button
                                    className={`${count == 20 ? 'bg-primary-400' : 'bg-primary-700'} text-white p-3 rounded-full aspect-square`}
                                    onClick={() => setCount(Math.min(count + 1, 20))}>
                                    <AddRounded/>
                                </button>
                            </div>
                            <span className={'text-xl font-bold text-primary-700 ml-auto mr-3'}>Итого:</span>
                            <p className={'rounded-full bg-primary-700 text-white py-2.5 px-4 text-lg font-semibold '}>{
                                extras.filter(extra => extra.applied).reduce((accumulator, extra) => accumulator + extra.price, 0)
                                + dish.price * count}₽</p>
                        </div>
                        <Button label={'Добавить в заказ'} dark onClick={onClose /*TODO: Add cart*/}/>
                    </div>
                </div>
            }
        </Modal>
    );
};

export default DishModal;