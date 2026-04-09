/**
 * @FilePath: src/stores/user.ts
 * @Author: chiwan
 * @Date: 2026-04-09
 * @Description: 用户状态管理
 * @LastEditTime: 2026-04-09
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<User | null>(null)
  const isLoading = ref(false)

  // Getters
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)
  const isAdmin = computed(() => userInfo.value?.role === 'admin')
  const isModerator = computed(() => 
    userInfo.value?.role === 'admin' || userInfo.value?.role === 'moderator'
  )

  // Actions
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUserInfo = (info: User) => {
    userInfo.value = info
  }

  const clearUserInfo = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  // 模拟登录
  const login = async (username: string, password: string) => {
    isLoading.value = true
    try {
      // TODO: 替换为真实的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟用户数据
      const mockUser: User = {
        id: 1,
        username,
        nickname: '测试用户',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        email: 'test@example.com',
        bio: '这是一个测试用户',
        role: 'user',
        createdAt: '2026-04-09',
        updatedAt: '2026-04-09',
        postCount: 10,
        commentCount: 25,
        reputation: 100
      }
      
      setToken('mock_token_' + Date.now())
      setUserInfo(mockUser)
      return true
    } catch (error) {
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 模拟注册
  const register = async (data: { username: string; password: string; email: string; nickname: string }) => {
    isLoading.value = true
    try {
      // TODO: 替换为真实的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
    } catch (error) {
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 退出登录
  const logout = () => {
    clearUserInfo()
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) return
    
    try {
      // TODO: 替换为真实的API调用
      // const res = await http.get<User>('/user/info')
      // setUserInfo(res.data)
    } catch (error) {
      clearUserInfo()
    }
  }

  // 更新用户信息
  const updateUserInfo = async (data: Partial<User>) => {
    try {
      // TODO: 替换为真实的API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      if (userInfo.value) {
        Object.assign(userInfo.value, data)
      }
      return true
    } catch (error) {
      return false
    }
  }

  return {
    token,
    userInfo,
    isLoading,
    isLoggedIn,
    isAdmin,
    isModerator,
    setToken,
    setUserInfo,
    clearUserInfo,
    login,
    register,
    logout,
    fetchUserInfo,
    updateUserInfo
  }
})
