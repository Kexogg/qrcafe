import { HourglassBottomRounded } from '@mui/icons-material'
import styles from './LoadingSpinner.module.css'
export const LoadingSpinner = () => {
    return (
        <div
            className={
                'flex h-full items-center justify-center ' + styles.spinner
            }>
            <HourglassBottomRounded
                fontSize={'large'}
                className={styles.spinner1}
            />
            <HourglassBottomRounded
                fontSize={'large'}
                className={styles.spinner2}
            />
        </div>
    )
}
