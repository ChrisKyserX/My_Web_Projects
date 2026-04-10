<!--
 * @FilePath: src/App.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 应用主组件 - 美化版本
 * @LastEditTime: 2026-04-10
-->

<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import {
  HomeFilled,
  Grid,
  Trophy,
  Search,
  User,
  Plus,
  Moon,
  Sunny
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isDark = ref(false)

// [MODIFY] 2026-04-10 chiwan: 使用 store 的 isLoggedIn 替代 localStorage 检查
const isLoggedIn = computed(() => userStore.isLoggedIn)

// [ADD] 2026-04-10 chiwan: 获取用户头像
const userAvatar = computed(() => {
  return userStore.userInfo?.avatar || ''
})

// 导航菜单
const navItems = [
  { path: '/', label: '首页', icon: HomeFilled },
  { path: '/category', label: '分类', icon: Grid },
  { path: '/ranking', label: '排行', icon: Trophy },
  { path: '/search', label: '搜索', icon: Search }
]

// 判断当前路由是否激活
const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// 切换暗黑模式
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

// [ADD] 2026-04-10 chiwan: 跳转到用户设置页
const goToSettings = () => {
  router.push('/settings')
}

// [MODIFY] 2026-04-10 chiwan: 退出登录，使用 store 清除状态
const handleLogout = () => {
  userStore.clearUserInfo()
  router.push('/login')
}
</script>

<template>
  <div class="app-wrapper" :class="{ 'dark-mode': isDark }">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-container">
        <!-- Logo -->
        <div class="logo-section">
          <img alt="Logo" class="logo-img" src="@/assets/logo.svg" />
          <span class="logo-text">个人论坛</span>
        </div>

        <!-- 主导航 -->
        <nav class="main-nav">
          <RouterLink 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ active: isActive(item.path) }"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>

        <!-- 右侧操作区 -->
        <div class="header-actions">
          <el-button
            type="primary"
            class="create-btn"
            @click="$router.push('/create')"
          >
            <el-icon><Plus /></el-icon>
            <span>发布</span>
          </el-button>

          <el-button
            circle
            class="theme-toggle"
            @click="toggleDarkMode"
          >
            <el-icon :size="18">
              <Moon v-if="!isDark" />
              <Sunny v-else />
            </el-icon>
          </el-button>

          <!-- [MODIFY] 2026-04-10 chiwan: 根据登录状态显示不同内容 -->
          <template v-if="isLoggedIn">
            <!-- 已登录：显示用户头像，点击进入设置页 -->
            <div class="user-avatar" @click="goToSettings">
              <el-avatar
                :size="36"
                :src="userAvatar"
                :icon="User"
                class="avatar-clickable"
              />
            </div>
          </template>
          <template v-else>
            <!-- 未登录：显示登录和注册按钮 -->
            <div class="auth-buttons">
              <el-button
                type="primary"
                plain
                @click="$router.push('/login')"
              >
                登录
              </el-button>
              <el-button
                type="primary"
                @click="$router.push('/register')"
              >
                注册
              </el-button>
            </div>
          </template>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="app-main">
      <RouterView />
    </main>

    <!-- 页脚 -->
    <footer class="app-footer">
      <div class="footer-container">
        <p class="footer-text">© 2026 个人论坛 - 基于 Vue 3 + Element Plus 构建</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;

  &.dark-mode {
    background: #1a1a2e;
  }
}

// 顶部导航栏
.app-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;

  .header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 12px;

    .logo-img {
      width: 36px;
      height: 36px;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .main-nav {
    display: flex;
    gap: 8px;

    .nav-link {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      color: var(--el-text-color-regular);
      text-decoration: none;
      font-size: 0.9375rem;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        color: var(--el-color-primary);
        background: var(--el-fill-color-light);
      }

      &.active {
        color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
      }

      .el-icon {
        font-size: 1.1rem;
      }
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;

    .create-btn {
      border-radius: 20px;
      padding: 8px 20px;

      .el-icon {
        margin-right: 4px;
      }
    }

    .theme-toggle {
      border: none;
      background: var(--el-fill-color-light);

      &:hover {
        background: var(--el-fill-color);
      }
    }

    .user-avatar {
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      transition: all 0.3s ease;

      &:hover {
        background: var(--el-fill-color-light);
      }

      .avatar-clickable {
        cursor: pointer;
      }
    }

    // [ADD] 2026-04-10 chiwan: 登录注册按钮样式
    .auth-buttons {
      display: flex;
      gap: 8px;
    }
  }
}

// 主内容区
.app-main {
  flex: 1;
  padding: 20px 0;
}

// 页脚
.app-footer {
  background: white;
  border-top: 1px solid var(--el-border-color-lighter);
  padding: 24px 0;
  margin-top: auto;

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
  }

  .footer-text {
    color: var(--el-text-color-secondary);
    font-size: 0.875rem;
  }
}

// 响应式适配
@media (max-width: 768px) {
  .app-header {
    .header-container {
      height: 56px;
      padding: 0 16px;
    }

    .logo-text {
      display: none;
    }

    .main-nav {
      gap: 4px;

      .nav-link {
        padding: 8px 12px;

        span {
          display: none;
        }
      }
    }

    .header-actions {
      .create-btn span {
        display: none;
      }
    }
  }
}
</style>
