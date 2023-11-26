type ChipProps = {
    text: string;
}

export const Chip = ({text}: ChipProps) => {
    return (
        <li className={'py-1 px-3 bg-primary-700 rounded-full text-center text-white font-medium text-lg inline-block'}>{text}</li>
    );
};