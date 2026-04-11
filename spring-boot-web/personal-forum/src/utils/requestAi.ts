/**
 * @FilePath: src/utils/requestAi.ts
 * @Author: chiwan
 * @Date: 2026-04-11
 * @Description: Axios请求封装，包含拦截器、错误处理和请求方法
 * @LastEditTime: 2026-04-10
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

// [ADD] 2026-04-10 chiwan: 设置全局 token 的函数（同时更新 sessionStorage）
export const setGlobalToken = (token: string) => {
  sessionStorage.setItem('token', token)
}

// [ADD] 2026-04-10 chiwan: 清除全局 token 的函数（同时清除 sessionStorage）
export const clearGlobalToken = () => {
  sessionStorage.removeItem('token')
}

// [ADD] 2026-04-10 chiwan: 从 sessionStorage 获取 token
export const getGlobalToken = (): string => {
  return sessionStorage.getItem('token') || ''
}

// 创建axios实例
const request: AxiosInstance = axios.create({
  // [MODIFY] 2026-04-10 chiwan: 更新API基础URL
  baseURL: '/agent',
  timeout: 120000,
  // [ADD] 2026-04-10 chiwan: 允许跨域携带cookie
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // [MODIFY] 2026-04-10 chiwan: 从 sessionStorage 获取 token
    const token = getGlobalToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response
    return data
  },
  (error) => {
    const { response } = error
    throw new Error(response?.data || "fail"+error.message)
  }
)

// 封装请求方法
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.get(url, config)
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.post(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.put(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.delete(url, config)
  },

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.patch(url, data, config)
  }
}

export default request
