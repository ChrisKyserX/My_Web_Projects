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

export interface UpdateUserParams {
  userId?: Number,
  nickname?: string
  email?: string
  avatar?: string
  // [MODIFY] 2026-04-10 chiwan: 性别改为数字类型 0=女, 1=男, 2=保密
  sex?: 0 | 1 | 2
  birthday?: string
}

// [MODIFY] 2026-04-11 chiwan: 修改密码参数格式适配后端接口
export interface ChangePasswordParams {
  userId?: number
  password: string
  newPassword: string
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
  return http.post('/getCommonInfo', {})
}

/**
 * 更新用户信息
 * @param params 更新参数
 * @returns Promise
 */
export const updateUser = (params: UpdateUserParams) => {
  return http.post('/user/updateUser', params)
}

/**
 * 修改密码
 * @param params 密码参数
 * @returns Promise
 */
export const changePassword = (params: ChangePasswordParams) => {
  return http.post('/user/changePassword', params)
}
