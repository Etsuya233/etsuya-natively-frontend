import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // 目标服务器地址
        changeOrigin: true,  // 如果接口跨域，需要设置为 true
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '')  // 可选：重写路径
      },
      '/data': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/data/, '')
      }
    }
  }
})
