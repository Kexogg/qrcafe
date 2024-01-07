import QRCode from 'react-qr-code'
import { Button } from '../../../components/UI/Button/Button.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import { ITable } from '../../../types/ITable.ts'
import { PDFViewer, pdf } from '@react-pdf/renderer'
import { useEffect, useRef, useState } from 'react'
import { QRCodePDF } from './QRCodePDF.tsx'

type TableQrModalProps = {
    onClose: () => void
    open: boolean
    table: ITable
}

export const TableQrModal = ({ onClose, open, table }: TableQrModalProps) => {
    const svgRef = useRef(null)
    const [innerSvg, setInnerSvg] = useState<HTMLCollection | null>(null)
    useEffect(() => {
        if (svgRef.current) {
            setInnerSvg((svgRef.current as SVGElement)?.children)
        }
    }, [])

    return (
        <Modal open={open} onClose={onClose} autoHeight>
            {table?.id && (
                <>
                    <QRCode
                        value={table?.id || ''}
                        ref={svgRef}
                        className={'hidden'}
                    />
                    {innerSvg && innerSvg.length > 0 && (
                        <>
                            <PDFViewer className={'aspect-[1/1.4]'}>
                                <QRCodePDF svgData={innerSvg} />
                            </PDFViewer>
                            <Button
                                dark
                                label={'Скачать'}
                                onClick={async () => {
                                    await pdf(<QRCodePDF svgData={innerSvg} />)
                                        .toBlob()
                                        .then((blob) => {
                                            const url =
                                                window.URL.createObjectURL(blob)
                                            const a =
                                                document.createElement('a')
                                            a.href = url
                                            a.download = `qr-${table.id}.pdf`
                                            a.click()
                                            onClose()
                                        })
                                }}
                            />
                            <Button
                                border
                                label={'Закрыть'}
                                onClick={onClose}
                            />
                        </>
                    )}
                </>
            )}
        </Modal>
    )
}
