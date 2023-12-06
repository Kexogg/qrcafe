export const BuildInfo = () => {
    return (
        <>
            {import.meta.env.MODE.toUpperCase()} BUILD{' '}
            {
                // @ts-expect-error Defined in vite-env.d.ts
                BUILD_TIMESTAMP
            }
        </>
    )
}
