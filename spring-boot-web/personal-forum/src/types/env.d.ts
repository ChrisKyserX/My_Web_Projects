/**
 * @FilePath: src/types/env.d.ts
 * @Author: chiwan
 * @Date: 2026-04-11
 * @Description: 环境变量类型定义
 * @LastEditTime: 2026-04-11
 */

// [ADD] 2026-04-11 chiwan: Vite环境变量类型声明

/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 应用信息
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string

  // API配置
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string

  // 后端代理地址
  readonly VITE_PROXY_TARGET: string

  // OSS配置
  readonly VITE_OSS_REGION: string
  readonly VITE_OSS_BUCKET: string
  readonly VITE_OSS_ACCESS_KEY_ID: string
  readonly VITE_OSS_ACCESS_KEY_SECRET: string
  readonly VITE_OSS_UPLOAD_DIR: string

  // AI配置
  readonly VITE_AI_ENABLED: string
  readonly VITE_AI_API_KEY: string

  // 其他配置
  readonly VITE_UPLOAD_MAX_SIZE: string
  readonly VITE_PAGE_SIZE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// [ADD] 2026-04-11 chiwan: 全局变量类型声明
declare const __APP_VERSION__: string
