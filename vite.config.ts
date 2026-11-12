import { fileURLToPath, URL } from 'node:url' 
import { defineConfig, loadEnv } from 'vite' 
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()],
        dts: 'src/auto-imports.d.ts'
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts'
      })
    ],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
    },
    server: {
      port: 5173,
      open: false,
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:8001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return
            const path = id.replace(/\\/g, '/')
            if (path.includes('element-plus') || path.includes('@element-plus/icons-vue')) return 'element'
            if (
              path.includes('/vue/') ||
              path.includes('/@vue/') ||
              path.includes('vue-router') ||
              path.includes('pinia')
            ) {
              return 'vue'
            }
          }
        }
      }
    }
  }
})