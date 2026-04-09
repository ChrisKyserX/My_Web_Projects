/**
 * @FilePath: src/stores/app.ts
 * @Author: chiwan
 * @Date: 2026-04-09
 * @Description: 应用全局状态管理
 * @LastEditTime: 2026-04-09
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const isDarkMode = ref<boolean>(localStorage.getItem('theme') === 'dark')
  const isSidebarCollapsed = ref<boolean>(false)
  const isMobile = ref<boolean>(false)
  const pageLoading = ref<boolean>(false)
  const searchKeyword = ref<string>('')

  // Getters
  const theme = computed(() => isDarkMode.value ? 'dark' : 'light')

  // Actions
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
    
    // 切换HTML的dark类
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      isDarkMode.value = true
      document.documentElement.classList.add('dark')
    }
  }

  const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }

  const setMobile = (value: boolean) => {
    isMobile.value = value
  }

  const setPageLoading = (value: boolean) => {
    pageLoading.value = value
  }

  const setSearchKeyword = (value: string) => {
    searchKeyword.value = value
  }

  return {
    isDarkMode,
    isSidebarCollapsed,
    isMobile,
    pageLoading,
    searchKeyword,
    theme,
    toggleTheme,
    initTheme,
    toggleSidebar,
    setMobile,
    setPageLoading,
    setSearchKeyword
  }
})
