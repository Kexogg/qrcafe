export const BuildInfo = () => {
    return (
        // @ts-expect-error Defined in vite-env.d.ts
        <>BUILD DATE {BUILD_TIMESTAMP}</>
    );
};