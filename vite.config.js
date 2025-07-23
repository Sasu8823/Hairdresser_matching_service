import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 5173,
        open: true,
        allowedHosts: ['e14f79d60c27.ngrok-free.app'],
    },
    build: {
        outDir: 'dist',
    },
});