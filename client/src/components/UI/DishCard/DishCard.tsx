import {IDish} from "../../../types/IDish.ts";

type DishCardProps = {
    dish: IDish;
    onClick?: () => void;
}
const DishCard = ({dish, onClick}: DishCardProps) => {
    return (
        <li key={dish.id}>
            <button className={'w-full p-5 bg-primary-50 rounded-3xl flex gap-7 text-left'} onClick={onClick}>
                <div className={'relative w-28 h-28 md:w-40 md:h-40 flex shrink-0'}>
                    <img className={'absolute w-full aspect-square object-cover rounded-3xl shadow'} src={dish.image}
                         alt={dish.name}/>
                    <p className={'relative text-gray-200 bg-neutral-400 bg-opacity-30 backdrop-blur-sm rounded-2xl p-3 w-fit text-right mt-auto mb-2 ml-2 font-bold'}>{dish.price} ₽</p>
                </div>
                <div className={'h-auto flex flex-col'}>
                    <h3 className={'text-primary-700 font-semibold text-xl'}>{dish.name}</h3>
                    <p className={'text-primary-500 md:text-lg font-normal'}>{dish.description}</p>
                    <p className={'text-primary-700 md:text-lg font-normal mt-auto block'}>{dish.weight}</p>
                </div>
            </button>
        </li>
    );
};

export default DishCard;