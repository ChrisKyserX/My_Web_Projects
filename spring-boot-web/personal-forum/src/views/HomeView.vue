<!--
 * @FilePath: src/views/HomeView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 论坛首页 - 现代化美化版本
 * @LastEditTime: 2026-04-10
-->

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChatDotRound, View, TrendCharts, Star, ArrowRight, Plus } from '@element-plus/icons-vue'

const router = useRouter()

// 统计数据
const stats = ref([
  { label: '总帖子', value: '12,580', icon: ChatDotRound, color: '#409eff' },
  { label: '今日活跃', value: '1,234', icon: View, color: '#67c23a' },
  { label: '总用户', value: '8,956', icon: TrendCharts, color: '#e6a23c' },
  { label: '精华帖', value: '386', icon: Star, color: '#f56c6c' }
])

// 热门分类
const categories = ref([
  { id: 1, name: '技术讨论', icon: '💻', count: 2340, color: '#409eff' },
  { id: 2, name: '生活分享', icon: '🌟', count: 1856, color: '#67c23a' },
  { id: 3, name: '问答互助', icon: '❓', count: 1234, color: '#e6a23c' },
  { id: 4, name: '资源分享', icon: '📦', count: 892, color: '#f56c6c' },
  { id: 5, name: '求职招聘', icon: '💼', count: 567, color: '#9254de' },
  { id: 6, name: '兴趣爱好', icon: '🎨', count: 789, color: '#ff7d00' }
])

// 最新帖子
const latestPosts = ref([
  { id: 1, title: 'Vue 3 + TypeScript 最佳实践分享', author: '前端小王子', views: 1234, likes: 89, time: '10分钟前', tag: '技术讨论' },
  { id: 2, title: '如何优雅地处理异步请求？', author: '代码诗人', views: 892, likes: 56, time: '30分钟前', tag: '问答互助' },
  { id: 3, title: '分享我收藏的实用开发工具', author: '工具达人', views: 2341, likes: 234, time: '1小时前', tag: '资源分享' },
  { id: 4, title: '2024年前端面试经验总结', author: '求职小白', views: 5678, likes: 445, time: '2小时前', tag: '求职招聘' },
  { id: 5, title: '周末徒步旅行照片分享', author: '山野行者', views: 445, likes: 67, time: '3小时前', tag: '生活分享' }
])

// 跳转到分类
const goToCategory = (id: number) => {
  router.push(`/category/${id}`)
}

// 跳转到帖子详情
const goToPost = (id: number) => {
  router.push(`/post/${id}`)
}

// 创建新帖子
const createPost = () => {
  router.push('/create')
}
</script>

<template>
  <div class="home-container">
    <!-- 欢迎横幅 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">欢迎来到个人论坛</h1>
        <p class="hero-subtitle">分享知识、交流经验、连接志同道合的朋友</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="createPost" :icon="Plus">
            发布帖子
          </el-button>
          <el-button size="large" plain @click="$router.push('/ranking')" :icon="TrendCharts">
            查看排行
          </el-button>
        </div>
      </div>
      <div class="hero-decoration">
        <div class="decoration-circle circle-1"></div>
        <div class="decoration-circle circle-2"></div>
        <div class="decoration-circle circle-3"></div>
      </div>
    </section>

    <!-- 统计数据 -->
    <section class="stats-section">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="6" v-for="stat in stats" :key="stat.label">
          <div class="stat-card">
            <el-icon class="stat-icon" :size="32" :color="stat.color">
              <component :is="stat.icon" />
            </el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </section>

    <!-- 热门分类 -->
    <section class="categories-section">
      <div class="section-header">
        <h2 class="section-title">热门分类</h2>
        <el-button link type="primary" @click="$router.push('/category')">
          查看全部 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <el-row :gutter="16">
        <el-col :xs="12" :sm="8" :md="4" v-for="cat in categories" :key="cat.id">
          <div 
            class="category-card" 
            @click="goToCategory(cat.id)"
            :style="{ '--cat-color': cat.color }"
          >
            <div class="category-icon">{{ cat.icon }}</div>
            <div class="category-name">{{ cat.name }}</div>
            <div class="category-count">{{ cat.count }} 帖子</div>
          </div>
        </el-col>
      </el-row>
    </section>

    <!-- 最新帖子 -->
    <section class="posts-section">
      <div class="section-header">
        <h2 class="section-title">最新帖子</h2>
        <el-button link type="primary" @click="$router.push('/posts')">
          查看更多 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <div class="posts-list">
        <div 
          v-for="post in latestPosts" 
          :key="post.id" 
          class="post-item"
          @click="goToPost(post.id)"
        >
          <div class="post-main">
            <el-tag size="small" effect="plain" class="post-tag">{{ post.tag }}</el-tag>
            <h3 class="post-title">{{ post.title }}</h3>
            <div class="post-meta">
              <span class="post-author">
                <el-avatar :size="20" :icon="ChatDotRound" />
                {{ post.author }}
              </span>
              <span class="post-time">{{ post.time }}</span>
            </div>
          </div>
          <div class="post-stats">
            <span class="stat-item">
              <el-icon><View /></el-icon>
              {{ post.views }}
            </span>
            <span class="stat-item">
              <el-icon><Star /></el-icon>
              {{ post.likes }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

// 欢迎横幅
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 60px 40px;
  margin-bottom: 40px;
  overflow: hidden;
  color: white;
  text-align: center;

  .hero-content {
    position: relative;
    z-index: 1;
  }

  .hero-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 16px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .hero-subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    margin-bottom: 32px;
  }

  .hero-actions {
    display: flex;
    gap: 16px;
    justify-content: center;

    .el-button {
      border-radius: 25px;
      padding: 12px 32px;
      font-size: 1rem;
    }
  }

  .hero-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;

    .decoration-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);

      &.circle-1 {
        width: 300px;
        height: 300px;
        top: -100px;
        right: -50px;
      }

      &.circle-2 {
        width: 200px;
        height: 200px;
        bottom: -50px;
        left: -50px;
      }

      &.circle-3 {
        width: 150px;
        height: 150px;
        top: 50%;
        left: 30%;
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }
}

// 统计数据
.stats-section {
  margin-bottom: 40px;

  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--el-fill-color-light);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-info {
      .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--el-text-color-primary);
        line-height: 1.2;
      }

      .stat-label {
        font-size: 0.875rem;
        color: var(--el-text-color-secondary);
        margin-top: 4px;
      }
    }
  }
}

// 分类区域
.categories-section {
  margin-bottom: 40px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .category-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

    &:hover {
      transform: translateY(-4px);
      border-color: var(--cat-color);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

      .category-icon {
        transform: scale(1.1);
      }
    }

    .category-icon {
      font-size: 2.5rem;
      margin-bottom: 12px;
      transition: transform 0.3s ease;
    }

    .category-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 4px;
    }

    .category-count {
      font-size: 0.875rem;
      color: var(--el-text-color-secondary);
    }
  }
}

// 帖子列表
.posts-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .posts-list {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    overflow: hidden;

    .post-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid var(--el-border-color-lighter);
      cursor: pointer;
      transition: all 0.3s ease;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: var(--el-fill-color-light);

        .post-title {
          color: var(--el-color-primary);
        }
      }

      .post-main {
        flex: 1;

        .post-tag {
          margin-bottom: 8px;
        }

        .post-title {
          font-size: 1rem;
          font-weight: 500;
          color: var(--el-text-color-primary);
          margin-bottom: 8px;
          transition: color 0.3s ease;
        }

        .post-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 0.875rem;
          color: var(--el-text-color-secondary);

          .post-author {
            display: flex;
            align-items: center;
            gap: 6px;
          }
        }
      }

      .post-stats {
        display: flex;
        gap: 20px;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.875rem;
          color: var(--el-text-color-secondary);

          .el-icon {
            font-size: 1rem;
          }
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .hero-section {
    padding: 40px 24px;

    .hero-title {
      font-size: 1.75rem;
    }

    .hero-subtitle {
      font-size: 1rem;
    }

    .hero-actions {
      flex-direction: column;
      align-items: center;
    }
  }

  .stat-card {
    margin-bottom: 16px;
  }

  .post-item {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 12px;

    .post-stats {
      width: 100%;
      justify-content: flex-start;
    }
  }
}
</style>
