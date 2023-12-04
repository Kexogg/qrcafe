import {AddRounded, ArrowBackRounded, RemoveRounded} from "@mui/icons-material";
import {getDishTotal, getPlaceholderDish, IDish} from "../../types/IDish.ts";
import {useState} from "react";


export const CustomerCart = () => {
    const dishes = [
        getPlaceholderDish(),
        getPlaceholderDish(),
        getPlaceholderDish(),
        getPlaceholderDish(),
        getPlaceholderDish()
    ]
    const [cart, setCart] = useState<IDish[]>(dishes);
    const totalCost = cart.reduce((acc, dish) => acc + getDishTotal(dish), 0);
    return (
        <>
            <section className={'px-3 container mx-auto'}>
                <div className={'text-accent-800 flex gap-5 pb-5 items-center'}>
                    <ArrowBackRounded fontSize={'large'}/>
                    <h1>Ваш заказ</h1>
                    <button className={'ml-auto text-primary-700'}>Удалить всё</button>
                </div>
                <ul className={'flex gap-5 flex-col'}>
                    {cart.map((item) => (
                        <li key={item.id} className={'flex gap-5 items-start max-w-lg'}>
                            <img src={item.image} alt={item.name}
                                 className={'w-40 h-40 shrink-0 rounded-3xl object-cover'}/>
                            <div className={'flex flex-col gap-1 w-full'}>
                                <h2 className={'text-accent-800 text-2xl'}>{item.name}</h2>
                                <div className={'flex flex-col gap-1'}>
                                    {
                                        item.extras.filter((extra) => extra.applied).length > 0 &&
                                        <>
                                            <h3 className={'text-accent-800'}>Добавки</h3>
                                            <p className={'flex flex-wrap gap-3'}>
                                                {item.extras.map((extra, index) => (
                                                    extra.applied &&
                                                    <>{extra.name}{index !== item.extras.filter((extra) => extra.applied).length - 1 && ', '}</>
                                                ))}
                                            </p>
                                        </>
                                    }
                                </div>
                                <div className={'flex items-center justify-between mt-auto'}>
                                    <div className={'flex items-center'}>
                                        <button
                                            className={`${item.count == 1 ? 'bg-primary-400' : 'bg-primary-700'} text-white p-2 rounded-full aspect-square`}>
                                            <RemoveRounded/>
                                        </button>
                                        <span
                                            className={'font-semibold text-xl text-primary-700 mx-3 w-3 text-center'}>{item.count ?? 1 /*TODO: remove later*/}</span>
                                        <button
                                            className={`${item.count == 20 ? 'bg-primary-400' : 'bg-primary-700'} text-white p-2 rounded-full aspect-square`}>
                                            <AddRounded/>
                                        </button>
                                    </div>
                                    <p className={'text-primary-700 text-lg font-semibold'}>{getDishTotal(item)}₽</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
            <button
                className={'sticky block justify-center bottom-16 rounded-full my-4 left-0 w-full max-w-sm mx-auto bg-primary-700 text-white text-xl font-bold shadow p-3 divide-solid divide-x'}>
                <span className={'pr-2'}>Оформить заказ</span>
                <span className={'pl-2'}>{totalCost}₽</span>
            </button>
        </>
    );
};