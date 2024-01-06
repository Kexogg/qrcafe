import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    const config = {
        define: {
            BUILD_TIMESTAMP: new Date(),
        },
        plugins: [react()],
        server: {},
    }
    if (command === 'serve')
        config.server = {
            proxy: {
                '/api': {
                    target: 'https://nyashdev.stk8s.66bit.ru/api',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        }
    return config
})
