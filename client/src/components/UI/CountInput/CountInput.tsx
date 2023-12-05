import {AddRounded, RemoveRounded} from "@mui/icons-material";
import {useState} from "react";

type CountInputProps = {
    onCountChange: (count: number) => void;
    min?: number;
    max?: number;
    count: number;
}

export const CountInput = ({onCountChange, min, max, count}: CountInputProps) => {
    const [currentCount, setCurrentCount] = useState(count);

    return (
        <div className={'flex items-center h-full'}>
            <button
                disabled={count <= (min ?? 1) }
                onClick={() => {
                    onCountChange(count - 1)
                    setCurrentCount(count - 1)
                }}
                className={`disabled:bg-primary-400 bg-primary-700 h-full text-white p-2 rounded-full aspect-square`}>
                <RemoveRounded/>
            </button>
            <span
                className={'font-semibold text-xl text-primary-700 mx-3 text-center'}>{currentCount}</span>
            <button
                disabled={count >= (max ?? 20)}
                onClick={() => {
                    onCountChange(count + 1)
                    setCurrentCount(count + 1)
                }}
                className={`disabled:bg-primary-400 bg-primary-700 h-full text-white p-2 rounded-full aspect-square`}>
                <AddRounded/>
            </button>
        </div>
    );
};