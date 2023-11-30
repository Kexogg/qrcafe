import {ReactNode, useEffect, useRef, useState} from 'react';

type ModalProps = {
    children: ReactNode,
    title: string,
    open: boolean,
    onClose?: () => void;
}

const Modal = ({children, title, onClose, open}: ModalProps) => {
    const [isOpen, setIsOpen] = useState(open);
    const modalRef = useRef<HTMLDialogElement>(null);

    const closeModal = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        if (open) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [open]);

    return (
        <dialog className={'h-[80dvh] container max-w-md bg-transparent p-3'} ref={modalRef} open={isOpen}
                onKeyDown={(e) => {
                    if (e.key == 'Escape' && onClose) onClose()
                }}
                onClick={() => {
                    if (onClose) onClose()
                }}
                onClose={closeModal}>
            <div className={'p-3 bg-primary-50 h-full w-full rounded-3xl flex flex-col text-left'}
                 onKeyDown={() => null} onClick={(e) => e.stopPropagation()}>
                <h1 className={'text-center'}>{title}</h1>
                <div className={'overflow-y-scroll p-3 flex flex-col'}>
                    {children}
                </div>
            </div>
        </dialog>
    );
};

export default Modal;