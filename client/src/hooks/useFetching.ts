import { useState } from 'react'

export const useFetching = (callback: () => Promise<void>) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const fetching = async () => {
        try {
            setIsLoading(true)
            await callback()
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message)
            }
            if (typeof e === 'string') {
                setError(e)
            }
        } finally {
            setIsLoading(false)
        }
    }
    return [fetching, isLoading, error]
}
