import {Dish} from "../../../types/Dish.ts";

type ShowcaseProps = {
    title: string;
    items: Dish[];
}

export const Showcase = ({title, items}: ShowcaseProps) => {
    //TODO: Press shift to scroll on desktop tutorial
    //TODO: Modal window on click
    return (
        <section>
            <h2 className={'text-accent-800 font-bold text-3xl ml-5 my-5 align-middle'}>{title}</h2>
            <ul className={'flex gap-3 overflow-y-scroll snap-x snap-mandatory no-scrollbar cursor-grab'}>
                <div className={'w-0 max-w-0 grow-0'}></div>
                {items.map((item) => (
                    <li key={item.id}
                        className={'snap-center group relative flex w-48 h-48 rounded-3xl shadow overflow-hidden shrink-0'}>
                        <img src={item.image} alt={item.name}
                             className={'z-0 absolute w-full h-full object-cover group-hover:scale-110 transition-transform'}/>
                        <p className={'relative text-gray-200 bg-neutral-400 bg-opacity-30 backdrop-blur-sm rounded-2xl p-3 w-fit text-right mt-auto ml-auto mb-2 mr-2 font-bold'}>{item.name}</p>
                    </li>
                ))}
                <div className={'w-1 max-w-1 grow-0 shrink-0'}></div>
            </ul>
        </section>
    );
};