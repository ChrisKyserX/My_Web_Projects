<!--
 * @FilePath: src/components/layout/MainLayout.vue
 * @Author: chiwan
 * @Date: 2026-04-09
 * @Description: 主布局组件
 * @LastEditTime: 2026-04-09
-->

<template>
  <div class="main-layout">
    <AppHeader />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const appStore = useAppStore()
const userStore = useUserStore()

onMounted(() => {
  // 初始化主题
  appStore.initTheme()
  
  // 如果已登录，获取用户信息
  if (userStore.token) {
    userStore.fetchUserInfo()
  }
})
</script>

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 64px; // 为固定导航栏留出空间
  min-height: calc(100vh - 64px);
}

// 页面切换动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
