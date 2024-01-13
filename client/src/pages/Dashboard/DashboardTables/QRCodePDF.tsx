type QRCodePDFProps = {
    svgData: SVGElement
    pdf: typeof import('@react-pdf/renderer').default
    font: string
}
export const QRCodePDF = ({ svgData, pdf, font }: QRCodePDFProps) => {
    const { Document, Page, StyleSheet, Font, Text, View, Svg, Path } = pdf
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
                    <Svg
                        height={400}
                        width={400}
                        viewBox={svgData.getAttribute('viewBox') ?? ''}>
                        {Array.from(svgData.children).map((svg) => {
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
