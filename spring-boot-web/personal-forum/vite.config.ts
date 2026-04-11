/**
 * @FilePath: vite.config.ts
 * @Author: chiwan
 * @Date: 2026-04-11
 * @Description: Vite配置文件，支持多环境变量加载
 * @LastEditTime: 2026-04-11
 */

import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // [ADD] 2026-04-11 chiwan: 根据mode加载对应的环境变量文件（从项目根目录加载）
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), '')

  console.log('====',process.env.BAILIAN_API_KEY);
  

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    // [ADD] 2026-04-11 chiwan: 定义全局环境变量，可在客户端代码中使用
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '0.0.0'),
      __BAILIAN_API_KEY__: JSON.stringify(env.BAILIAN_API_KEY || ''),
    },
    server: {
      // [REF] 2026-04-10 chiwan: 统一配置api前缀代理，所有请求通过/api转发到后端
      // [MODIFY] 2026-04-11 chiwan: 使用环境变量配置代理目标地址
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'https://frp-six.com:56560',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/agent': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/agent/, '')
        }
      }
    }
  }
})
