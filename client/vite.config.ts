import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        BUILD_TIMESTAMP: new Date(),
    },
    plugins: [react()],
})
