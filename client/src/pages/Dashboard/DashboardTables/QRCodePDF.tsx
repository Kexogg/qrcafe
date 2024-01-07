import {
    Document,
    Font,
    Page,
    Path,
    StyleSheet,
    Svg,
    Text,
    View,
} from '@react-pdf/renderer'
import font from '../../../assets/Roboto-Bold.ttf'

type QRCodePDFProps = {
    svgData: HTMLCollection
}
export const QRCodePDF = ({ svgData }: QRCodePDFProps) => {
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
