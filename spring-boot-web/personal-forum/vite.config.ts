import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // [ADD] 2026-04-10 chiwan: 配置开发服务器代理以解决跨域问题
    proxy: {
      '/registerUser': {
        target: 'https://frp-six.com:56560',
        changeOrigin: true,
        secure: false,
      },
      '/loginUser': {
        target: 'https://frp-six.com:56560',
        changeOrigin: true,
        secure: false,
      },
      '/getCommonInfo': {
        target: 'https://frp-six.com:56560',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
