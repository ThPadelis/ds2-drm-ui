import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        noDiscovery: true,
        include: ['dash-button-web']
    },
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.startsWith('dash-')
                }
            }
        }),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '/ledger/readAll': {
                target: 'http://10.151.64.56:3000',
                secure: false,
                logLevel: 'debug',
                changeOrigin: true
                // pathRewrite: { '^/api/certh/segmentation-grad-cam': '/segmentation-grad-cam' },
                // rewrite: (p) => p.replace(/^\/api\/certh\/segmentation-grad-cam/, '/segmentation-grad-cam')
            },
            '/enroll/verify': {
                target: 'http://10.151.64.56:3000',
                secure: false,
                logLevel: 'debug',
                changeOrigin: true
                // pathRewrite: { '^/api/certh/segmentation-grad-cam': '/segmentation-grad-cam' },
                // rewrite: (p) => p.replace(/^\/api\/certh\/segmentation-grad-cam/, '/segmentation-grad-cam')
            },
            '/api': {
                target: 'http://10.151.64.56:3000',
                secure: false,
                logLevel: 'debug',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
});
