import { ReactNode, useEffect, useRef, useState } from 'react'

type ModalProps = {
    children: ReactNode
    title?: string
    autoHeight?: boolean
    open: boolean
    onClose?: () => void
}

const Modal = ({ children, title, onClose, open, autoHeight }: ModalProps) => {
    const [isOpen, setIsOpen] = useState(open)
    const modalRef = useRef<HTMLDialogElement>(null)

    const closeModal = () => {
        setIsOpen(false)
    }

    useEffect(() => {
        if (open) {
            modalRef.current?.showModal()
            document.body.style.overflow = 'hidden'
        } else {
            modalRef.current?.close()
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [open])

    return (
        <dialog
            className={`no-ring container ${
                autoHeight ? 'h-fit' : 'h-[95dvh]'
            } max-w-md bg-transparent p-3`}
            ref={modalRef}
            open={isOpen}
            onKeyDown={(e) => {
                if (e.key == 'Escape' && onClose) onClose()
            }}
            onClick={() => {
                if (onClose) onClose()
            }}
            onClose={closeModal}>
            <div
                className={
                    'relative flex h-full w-full flex-col rounded-3xl bg-primary-50 p-3 text-left'
                }
                onKeyDown={() => null}
                onClick={(e) => e.stopPropagation()}>
                {title && <h1 className={'text-center'}>{title}</h1>}
                <div
                    className={
                        'relative flex h-full flex-col gap-3 overflow-y-scroll p-3'
                    }>
                    {children}
                </div>
            </div>
        </dialog>
    )
}

export default Modal
