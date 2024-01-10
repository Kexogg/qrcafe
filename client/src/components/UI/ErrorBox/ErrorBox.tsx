import { AxiosError } from 'axios'

type ErrorBoxProps = {
    error: Error | AxiosError | string
}
export const ErrorBox = ({ error }: ErrorBoxProps) => {
    return (
        <div
            className={
                'my-2 rounded-3xl border-2 border-accent-700 bg-accent-100/50 p-3 text-accent-800'
            }>
            <h2>Произошла ошибка</h2>
            {error instanceof AxiosError
                ? error.response?.data.message
                : error instanceof Error
                  ? error.message
                  : error}
        </div>
    )
}
