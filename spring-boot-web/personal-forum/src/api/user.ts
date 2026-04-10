/**
 * @FilePath: src/api/user.ts
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 用户相关API接口
 * @LastEditTime: 2026-04-10
 */

import { http } from '@/utils/request'

export interface RegisterParams {
  account: string
  password: string
  email?: string
}

export interface LoginParams {
  account: string
  password: string
}

/**
 * 用户注册
 * @param params 注册参数
 * @returns Promise
 */
export const registerUser = (params: RegisterParams) => {
  return http.post('/registerUser', params)
}

/**
 * 用户登录
 * @param params 登录参数
 * @returns Promise
 */
export const loginUser = (params: LoginParams) => {
  return http.post('/loginUser', params)
}

/**
 * 获取用户公共信息
 * @returns Promise
 */
export const getCommonInfo = () => {
  return http.post('/getCommonInfo')
}
