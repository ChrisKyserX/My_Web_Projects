/**
 * @FilePath: src/router/index.ts
 * @Author: chiwan
 * @Date: 2026-04-09
 * @Description: 路由配置文件
 * @LastEditTime: 2026-04-09
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getCommonInfo } from '@/api/user'
import MainLayout from '@/components/layout/MainLayout.vue'

// [ADD] 2026-04-10 chiwan: 标记是否已获取用户信息（避免重复请求）
let hasFetchedUserInfo = false

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
          meta: { title: '首页' }
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('@/views/CategoryView.vue'),
          meta: { title: '分类' }
        },
        {
          path: 'tags',
          name: 'tags',
          component: () => import('@/views/TagView.vue'),
          meta: { title: '标签' }
        },
        {
          path: 'ranking',
          name: 'ranking',
          component: () => import('@/views/RankingView.vue'),
          meta: { title: '排行榜' }
        },
        {
          path: 'search',
          name: 'search',
          component: () => import('@/views/SearchView.vue'),
          meta: { title: '搜索结果' }
        },
        {
          path: 'post/:id',
          name: 'post-detail',
          component: () => import('@/views/PostDetailView.vue'),
          meta: { title: '帖子详情' }
        },
        {
          path: 'user/:id',
          name: 'user-profile',
          component: () => import('@/views/UserProfileView.vue'),
          meta: { title: '用户主页' }
        },
        // 需要登录的路由
        {
          path: 'post/create',
          name: 'create-post',
          component: () => import('@/views/CreatePostView.vue'),
          meta: { title: '发布帖子', requiresAuth: true }
        },
        {
          path: 'user',
          name: 'user',
          redirect: '/user/profile',
          children: [
            {
              path: 'profile',
              name: 'user-profile-page',
              component: () => import('@/views/user/ProfileView.vue'),
              meta: { title: '个人中心', requiresAuth: true }
            },
            {
              path: 'posts',
              name: 'user-posts',
              component: () => import('@/views/user/MyPostsView.vue'),
              meta: { title: '我的帖子', requiresAuth: true }
            },
            {
              path: 'settings',
              name: 'user-settings',
              component: () => import('@/views/user/SettingsView.vue'),
              meta: { title: '账号设置', requiresAuth: true }
            },
            // [ADD] 2026-04-10 chiwan: 修改密码页面
            {
              path: 'change-password',
              name: 'change-password',
              component: () => import('@/views/user/ChangePasswordView.vue'),
              meta: { title: '修改密码', requiresAuth: true }
            },
            // [ADD] 2026-04-11 chiwan: AI Agent页面
            {
              path: 'ai-agent',
              name: 'ai-agent',
              component: () => import('@/views/user/AIAgentView.vue'),
              meta: { title: 'AI Agent', requiresAuth: true }
            }
          ]
        }
      ]
    },
    // 认证页面（不需要布局）
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { title: '登录', guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { title: '注册', guestOnly: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { title: '忘记密码', guestOnly: true }
    },
    // 404页面
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: '页面未找到' }
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - Forum` : 'Forum'

  // [ADD] 2026-04-10 chiwan: 页面刷新且有 token 时，获取用户信息
  if (!hasFetchedUserInfo && userStore.token) {
    try {
      const userInfo = await getCommonInfo()
      if (userInfo) {
        userStore.setUserInfo(userInfo)
      }
    } catch (error) {
      // 获取失败，清除登录状态
      userStore.clearUserInfo()
    }
    hasFetchedUserInfo = true
  }

  // 需要登录的页面
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 仅限游客访问的页面（如登录页）
  if (to.meta.guestOnly && userStore.isLoggedIn) {
    next('/')
    return
  }

  next()
})

export default router
