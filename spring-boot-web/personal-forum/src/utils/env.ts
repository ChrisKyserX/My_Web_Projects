/**
 * @FilePath: src/utils/env.ts
 * @Author: chiwan
 * @Date: 2026-04-11
 * @Description: 环境变量工具函数
 * @LastEditTime: 2026-04-11
 */

// [ADD] 2026-04-11 chiwan: 环境变量访问工具模块

/**
 * 获取环境变量
 * @param key - 环境变量名
 * @param defaultValue - 默认值
 * @returns 环境变量值
 */
export const getEnv = (key: keyof ImportMetaEnv, defaultValue: string = ''): string => {
  return import.meta.env[key] || defaultValue
}

/**
 * 获取数值类型的环境变量
 * @param key - 环境变量名
 * @param defaultValue - 默认值
 * @returns 数值
 */
export const getEnvNumber = (key: keyof ImportMetaEnv, defaultValue: number = 0): number => {
  const value = import.meta.env[key]
  if (!value) return defaultValue
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * 获取布尔类型的环境变量
 * @param key - 环境变量名
 * @param defaultValue - 默认值
 * @returns 布尔值
 */
export const getEnvBoolean = (key: keyof ImportMetaEnv, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key]
  if (!value) return defaultValue
  return value === 'true' || value === '1'
}

// [ADD] 2026-04-11 chiwan: 常用环境变量快捷访问

/** 应用标题 */
export const APP_TITLE = getEnv('VITE_APP_TITLE', 'Forum')

/** 应用版本 */
export const APP_VERSION = getEnv('VITE_APP_VERSION', '0.0.0')

/** API基础地址 */
export const API_BASE_URL = getEnv('VITE_API_BASE_URL', '/api')

/** API请求超时时间（毫秒） */
export const API_TIMEOUT = getEnvNumber('VITE_API_TIMEOUT', 30000)

/** OSS区域 */
export const OSS_REGION = getEnv('VITE_OSS_REGION', '')

/** OSS存储桶 */
export const OSS_BUCKET = getEnv('VITE_OSS_BUCKET', '')

/** OSS AccessKey ID */
export const OSS_ACCESS_KEY_ID = getEnv('VITE_OSS_ACCESS_KEY_ID', '')

/** OSS AccessKey Secret */
export const OSS_ACCESS_KEY_SECRET = getEnv('VITE_OSS_ACCESS_KEY_SECRET', '')

/** OSS Oss Upload Dir */
export const VITE_OSS_UPLOAD_DIR = getEnv('VITE_OSS_UPLOAD_DIR', '')

/** AI功能是否启用 */
export const AI_ENABLED = getEnvBoolean('VITE_AI_ENABLED', false)

/** AI API密钥 */
export const AI_API_KEY = getEnv('VITE_AI_API_KEY', '')

/** AI模型 */
export const AI_MODEL = getEnv('VITE_AI_MODEL', 'gpt-3.5-turbo')

/** 上传文件最大大小（字节） */
export const UPLOAD_MAX_SIZE = getEnvNumber('VITE_UPLOAD_MAX_SIZE', 2 * 1024 * 1024)

/** 分页大小 */
export const PAGE_SIZE = getEnvNumber('VITE_PAGE_SIZE', 10)

/** 是否为开发环境 */
export const IS_DEV = import.meta.env.DEV

/** 是否为生产环境 */
export const IS_PROD = import.meta.env.PROD

/** 当前模式 */
export const MODE = import.meta.env.MODE
