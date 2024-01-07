import QRCode from 'react-qr-code'
import { Button } from '../../../components/UI/Button/Button.tsx'
import font from '../../../assets/Roboto-Bold.ttf'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import { ITable } from '../../../types/ITable.ts'
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    PDFViewer,
    Svg,
    Path,
    Font,
    pdf,
} from '@react-pdf/renderer'

type QRCodePDFProps = {
    svgData: HTMLCollection
}
const QRCodePDF = ({ svgData }: QRCodePDFProps) => {
    Font.register({
        family: 'Roboto',
        src: font,
        fontWeight: 'bold',
    })
    const styles = StyleSheet.create({
        page: {
            padding: 10,
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            fontFamily: 'Roboto',
            fontSize: '40px',
            fontWeight: 'bold',
        },
        qr: {
            margin: 10,
            padding: 10,
            flexGrow: 1,
        },
    })
    return (
        <Document>
            <Page size={'A4'} style={styles.page}>
                <Text>Наведите камеру телефона и сделайте заказ</Text>
                <View style={styles.qr}>
                    <Svg height={400} width={400} viewBox="0 0 21 21">
                        {Array.from(svgData).map((svg) => {
                            return (
                                <Path
                                    key={svg.id}
                                    d={
                                        (svg as SVGPathElement).getAttribute(
                                            'd',
                                        ) ?? ''
                                    }
                                    fill={
                                        (svg as SVGPathElement).getAttribute(
                                            'fill',
                                        ) ?? ''
                                    }
                                />
                            )
                        })}
                    </Svg>
                </View>
                <Text>{window.location.hostname}</Text>
            </Page>
        </Document>
    )
}

import { useEffect, useRef, useState } from 'react'

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
        <Modal open={open} onClose={onClose}>
            <QRCode value={table?.id || ''} ref={svgRef} className={'hidden'} />
            {innerSvg && innerSvg.length > 0 && (
                <>
                    <PDFViewer className={'aspect-[1/4]'}>
                        <QRCodePDF svgData={innerSvg} />
                    </PDFViewer>
                    <Button
                        dark
                        label={'Скачать'}
                        onClick={async () => {
                            await pdf(<QRCodePDF svgData={innerSvg} />)
                                .toBlob()
                                .then((blob) => {
                                    const url = window.URL.createObjectURL(blob)
                                    const a = document.createElement('a')
                                    a.href = url
                                    a.download = `qr-${table.id}.pdf`
                                    a.click()
                                    onClose()
                                })
                        }}
                    />
                </>
            )}
            <Button border label={'Закрыть'} onClick={onClose} />
        </Modal>
    )
}
