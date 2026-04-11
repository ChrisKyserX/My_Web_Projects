<!--
 * @FilePath: src/components/layout/AppHeader.vue
 * @Author: chiwan
 * @Date: 2026-04-09
 * @Description: 顶部导航栏组件
 * @LastEditTime: 2026-04-09
-->

<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo-section" @click="router.push('/')">
        <el-icon class="logo-icon" :size="32"><ChatDotRound /></el-icon>
        <span class="logo-text">Forum</span>
      </div>

      <!-- 导航菜单 -->
      <nav class="nav-menu">
        <router-link to="/" class="nav-item" :class="{ active: route.path === '/' }">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </router-link>
        <router-link to="/categories" class="nav-item" :class="{ active: route.path === '/categories' }">
          <el-icon><Grid /></el-icon>
          <span>分类</span>
        </router-link>
        <router-link to="/tags" class="nav-item" :class="{ active: route.path === '/tags' }">
          <el-icon><CollectionTag /></el-icon>
          <span>标签</span>
        </router-link>
        <router-link to="/ranking" class="nav-item" :class="{ active: route.path === '/ranking' }">
          <el-icon><Trophy /></el-icon>
          <span>排行</span>
        </router-link>
      </nav>

      <!-- 搜索框 -->
      <div class="search-section">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索帖子..."
          class="search-input"
          :prefix-icon="Search"
          clearable
          @keyup.enter="handleSearch"
        />
      </div>

      <!-- 右侧操作区 -->
      <div class="actions-section">
        <!-- 主题切换 -->
        <el-button
          class="action-btn"
          :icon="isDarkMode ? Sunny : Moon"
          circle
          @click="toggleTheme"
        />

        <!-- 未登录状态 -->
        <template v-if="!isLoggedIn">
          <el-button type="primary" @click="router.push('/login')">登录</el-button>
          <el-button @click="router.push('/register')">注册</el-button>
        </template>

        <!-- 已登录状态 -->
        <template v-else>
          <el-button class="action-btn" :icon="Plus" circle @click="handleCreatePost" />
          <el-button class="action-btn" :icon="Bell" circle />
          
          <el-dropdown trigger="click">
            <div class="user-avatar">
              <el-avatar :src="userInfo?.avatar" :size="36" />
              <el-icon class="dropdown-arrow"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/user/profile')">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item @click="router.push('/user/posts')">
                  <el-icon><Document /></el-icon>
                  我的帖子
                </el-dropdown-item>
                <el-dropdown-item @click="router.push('/user/settings')">
                  <el-icon><Setting /></el-icon>
                  账号设置
                </el-dropdown-item>
                <!-- [ADD] 2026-04-11 chiwan: 添加AI Agent菜单入口 -->
                <el-dropdown-item @click="router.push('/user/ai-agent')">
                  <el-icon><ChatDotSquare /></el-icon>
                  AI Agent
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import {
  ChatDotRound, HomeFilled, Grid, CollectionTag, Trophy,
  Search, Sunny, Moon, Plus, Bell, ArrowDown, User,
  Document, Setting, SwitchButton, ChatDotSquare
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

const searchKeyword = ref('')

// [FIX] 2026-04-10 chiwan: 使用computed确保登录状态变化时视图自动更新
const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.userInfo)
const isDarkMode = computed(() => appStore.isDarkMode)

const toggleTheme = () => {
  appStore.toggleTheme()
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { keyword: searchKeyword.value }
    })
  }
}

const handleCreatePost = () => {
  // [FIX] 2026-04-10 chiwan: 使用.value访问计算属性
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  router.push('/post/create')
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
  window.location.reload();
}
</script>

<style scoped lang="scss">
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--bg-overlay);
  border-bottom: 1px solid var(--border-light);
  box-shadow: var(--shadow-base);
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 24px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  
  .logo-icon {
    color: var(--primary-color);
  }
  
  .logo-text {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.5px;
  }
}

.nav-menu {
  display: flex;
  gap: 8px;
  flex: 1;
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: var(--radius-base);
    color: var(--text-regular);
    font-size: 14px;
    transition: all 0.3s ease;
    
    &:hover {
      color: var(--primary-color);
      background: var(--primary-light);
    }
    
    &.active {
      color: var(--primary-color);
      background: var(--primary-light);
      font-weight: 500;
    }
  }
}

.search-section {
  width: 280px;
  
  .search-input {
    :deep(.el-input__wrapper) {
      border-radius: 20px;
      background: var(--bg-page);
      box-shadow: none;
      
      &:hover, &:focus {
        box-shadow: 0 0 0 1px var(--primary-color) inset;
      }
    }
  }
}

.actions-section {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .action-btn {
    color: var(--text-regular);
    
    &:hover {
      color: var(--primary-color);
      background: var(--primary-light);
    }
  }
  
  .user-avatar {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    padding: 4px;
    border-radius: var(--radius-base);
    transition: background 0.3s ease;
    
    &:hover {
      background: var(--bg-page);
    }
    
    .dropdown-arrow {
      font-size: 12px;
      color: var(--text-secondary);
    }
  }
}

@media (max-width: 992px) {
  .nav-menu {
    display: none;
  }
  
  .search-section {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .search-section {
    display: none;
  }
  
  .header-container {
    padding: 0 16px;
  }
}
</style>
