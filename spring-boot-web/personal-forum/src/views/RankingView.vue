<!--
 * @FilePath: src/views/RankingView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 排行榜页面
 * @LastEditTime: 2026-04-10
-->

<script setup lang="ts">
import { ref } from 'vue'

const topPosts = ref([
  { id: 1, title: '如何学习 Vue 3', author: '用户A', views: 1234, likes: 89 },
  { id: 2, title: 'TypeScript 最佳实践', author: '用户B', views: 987, likes: 76 },
  { id: 3, title: '前端性能优化技巧', author: '用户C', views: 856, likes: 65 },
])
</script>

<template>
  <div class="ranking-view">
    <h1>排行榜</h1>
    <div class="ranking-list">
      <div v-for="(post, index) in topPosts" :key="post.id" class="ranking-item">
        <span class="rank">{{ index + 1 }}</span>
        <div class="post-info">
          <h3>{{ post.title }}</h3>
          <p>作者: {{ post.author }} | 浏览: {{ post.views }} | 点赞: {{ post.likes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ranking-view {
  padding: 20px;
}

.ranking-list {
  margin-top: 20px;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.rank {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 50%;
  font-weight: bold;
  margin-right: 16px;
}

.ranking-item:first-child .rank {
  background: #ffd700;
}

.ranking-item:nth-child(2) .rank {
  background: #c0c0c0;
}

.ranking-item:nth-child(3) .rank {
  background: #cd7f32;
}

.post-info h3 {
  margin: 0 0 8px 0;
}

.post-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}
</style>
