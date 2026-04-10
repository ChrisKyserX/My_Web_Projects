/**
 * @FilePath: src/utils/request.ts
 * @Author: chiwan
 * @Date: 2026-04-09
 * @Description: Axios请求封装，包含拦截器、错误处理和请求方法
 * @LastEditTime: 2026-04-10
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

// 创建axios实例
const request: AxiosInstance = axios.create({
  // [MODIFY] 2026-04-10 chiwan: 更新API基础URL
  baseURL: 'https://frp-six.com:56560',
  timeout: 10000,
  // [ADD] 2026-04-10 chiwan: 允许跨域携带cookie
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
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

    // [MODIFY] 2026-04-10 chiwan: 根据后端返回的code处理响应
    // code为0表示成功，1表示成功但没数据，其他都是失败
    if (data.code === 0) {
      return data.data
    } else if (data.code === 1) {
      // 成功但没数据，返回空或提示
      return null
    } else {
      // 其他code都是失败，抛出异常
      throw new Error(data.message || data.msg || data || '请求失败')
    }
  },
  (error) => {
    const { response } = error

    if (response) {
      switch (response.status) {
        case 401:
          localStorage.removeItem('token')
          window.location.href = '/login'
          throw new Error('登录已过期，请重新登录')
        case 403:
          throw new Error('没有权限访问')
        case 404:
          throw new Error('请求的资源不存在')
        case 500:
          throw new Error('服务器错误')
        default:
          throw new Error(response.data?.message || '网络错误')
      }
    } else {
      throw new Error('网络连接失败')
    }
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
