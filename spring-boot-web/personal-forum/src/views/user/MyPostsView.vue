<!--
 * @FilePath: src/views/user/MyPostsView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 我的帖子页面
 * @LastEditTime: 2026-04-10
-->

<script setup lang="ts">
import { ref } from 'vue'

const posts = ref([
  { id: 1, title: '我的第一篇帖子', status: 'published', views: 123, createdAt: '2026-04-09' },
  { id: 2, title: '学习 Vue 3 的心得', status: 'published', views: 89, createdAt: '2026-04-08' },
  { id: 3, title: '草稿帖子', status: 'draft', views: 0, createdAt: '2026-04-07' },
])

const handleDelete = (id: number) => {
  // [ADD] 2026-04-10 chiwan: 实现删除帖子逻辑
  console.log('删除帖子:', id)
}
</script>

<template>
  <div class="my-posts">
    <h1>我的帖子</h1>
    <div class="posts-list">
      <div v-for="post in posts" :key="post.id" class="post-item">
        <div class="post-info">
          <h3>{{ post.title }}</h3>
          <div class="post-meta">
            <span :class="['status', post.status]">{{ post.status === 'published' ? '已发布' : '草稿' }}</span>
            <span>浏览: {{ post.views }}</span>
            <span>{{ post.createdAt }}</span>
          </div>
        </div>
        <div class="post-actions">
          <button class="btn-edit">编辑</button>
          <button class="btn-delete" @click="handleDelete(post.id)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-posts {
  padding: 20px;
}

.posts-list {
  margin-top: 24px;
}

.post-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
}

.post-info h3 {
  margin: 0 0 8px 0;
}

.post-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status.published {
  background: #e1f3d8;
  color: #67c23a;
}

.status.draft {
  background: #f4f4f5;
  color: #909399;
}

.post-actions {
  display: flex;
  gap: 8px;
}

.post-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-edit {
  background: #409eff;
  color: white;
}

.btn-delete {
  background: #f56c6c;
  color: white;
}
</style>
