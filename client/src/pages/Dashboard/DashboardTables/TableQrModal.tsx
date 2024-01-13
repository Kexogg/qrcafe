import { Button } from '../../../components/UI/Button/Button.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import { ITable } from '../../../types/ITable.ts'
import { useEffect, useRef, useState } from 'react'
import { QRCodePDF } from './QRCodePDF.tsx'
import { useAppSelector } from '../../../hooks/hooks.ts'
import { getQRValue } from '../../../helpers.ts'

type TableQrModalProps = {
    onClose: () => void
    open: boolean
    table: ITable
}

export const TableQrModal = ({ onClose, open, table }: TableQrModalProps) => {
    const restaurantId = useAppSelector((state) => state.session.restaurantId)

    const svgRef = useRef(null)
    const [font, setFont] = useState<string>('')
    const [QrCode, setQRCode] = useState<
        typeof import('react-qr-code').default | null
    >(null)
    const [pdf, setPdf] = useState<
        typeof import('@react-pdf/renderer').default | null
    >(null)

    useEffect(() => {
        import('react-qr-code').then((QRCode) => {
            setQRCode(QRCode.default)
        })
        import('@react-pdf/renderer').then((pdf) => {
            setPdf(pdf.default)
        })
        import('../../../assets/Roboto-Bold.ttf').then((font) => {
            setFont(font.default)
        })
    }, [])

    if (!QrCode || !pdf) return null

    return (
        <Modal open={open} onClose={onClose} autoHeight>
            {table?.id && (
                <>
                    <div className={'mx-auto bg-white p-3'}>
                        <QrCode
                            value={getQRValue(restaurantId!, table.id)}
                            ref={svgRef}
                        />
                    </div>
                    <Button
                        dark
                        disabled={font === ''}
                        label={'Скачать'}
                        onClick={async () => {
                            await pdf
                                .pdf(
                                    <QRCodePDF
                                        font={font}
                                        svgData={
                                            svgRef.current as unknown as SVGElement
                                        }
                                        pdf={pdf}
                                    />,
                                )
                                .toBlob()
                                .then((blob: Blob) => {
                                    const url = window.URL.createObjectURL(blob)
                                    const a = document.createElement('a')
                                    a.href = url
                                    a.download = `qr-${table.id}.pdf`
                                    a.click()
                                    onClose()
                                })
                        }}
                    />
                    <Button border label={'Закрыть'} onClick={onClose} />
                </>
            )}
        </Modal>
    )
}
