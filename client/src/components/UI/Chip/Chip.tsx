type ChipProps = {
    text: string;
    active?: boolean;
    onClick?: () => void;
}

export const Chip = ({text, active, onClick}: ChipProps) => {
    return (
        <li onClick={onClick} className={`border-2 border-primary-700 py-1 px-3 ${active ? ' bg-primary-700 text-primary-50' : 'text-primary-700'} rounded-full text-center font-medium text-lg inline-block`}>{text}</li>
    );
};