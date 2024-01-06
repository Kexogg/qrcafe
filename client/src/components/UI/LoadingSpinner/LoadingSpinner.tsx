import { HourglassBottomRounded } from '@mui/icons-material'
import styles from './LoadingSpinner.module.css'
type LoadingSpinnerProps = {
    screenOverlay?: boolean
    elementOverlay?: boolean
}
export const LoadingSpinner = ({
    screenOverlay,
    elementOverlay,
}: LoadingSpinnerProps) => {
    return (
        <div
            className={`h-full ${elementOverlay && 'absolute w-full'} ${
                screenOverlay &&
                'fixed bottom-0 left-0 right-0 top-0 z-50 overflow-hidden bg-primary-950/10'
            }`}>
            <div className={styles.spinner}>
                <HourglassBottomRounded
                    fontSize={'large'}
                    className={styles.spinner1}
                />
                <HourglassBottomRounded
                    fontSize={'large'}
                    className={styles.spinner2}
                />
            </div>
        </div>
    )
}
