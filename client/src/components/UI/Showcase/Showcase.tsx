import {IDish} from "../../../types/IDish.ts";
import {useState} from "react";
import DishModal from "../Modal/DishModal.tsx";

type ShowcaseProps = {
    title: string;
    items: IDish[];
}

export const Showcase = ({title, items}: ShowcaseProps) => {
    const [activeItem, setActiveItem] = useState<IDish | null>(null);
    return (
        <section>
            <DishModal dish={activeItem} onClose={() => setActiveItem(null)} />
            <h2 className={'text-accent-800 font-bold text-3xl ml-5 my-5 align-middle'}>{title}</h2>
            <ul className={'flex gap-3 overflow-y-scroll snap-x snap-mandatory no-scrollbar px-5 py-1'}>
                {items.map((item) => (
                    <li key={item.id}>
                        <button onClick={() => setActiveItem(item)} className={'snap-center group relative flex justify-end w-48 h-48 rounded-3xl shadow overflow-hidden shrink-0'}>
                            <img src={item.image} alt={item.name}
                                 className={'absolute w-full h-full object-cover group-hover:scale-110 transition-transform'}/>
                            <div className={'max-w-[90%] relative text-gray-200 bg-neutral-400 bg-opacity-30 backdrop-blur-sm rounded-2xl p-3 text-right mt-auto mb-2 mr-2 font-bold'}>{item.name}</div>
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
};
