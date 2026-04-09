<!--
 * @FilePath: src/views/PostDetailView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 帖子详情页面
 * @LastEditTime: 2026-04-10
-->

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const postId = route.params.id

const post = ref({
  id: postId,
  title: '示例帖子标题',
  content: '这是帖子的详细内容...',
  author: '用户A',
  createdAt: '2026-04-10',
  views: 123,
  likes: 45,
})

const comments = ref([
  { id: 1, author: '用户B', content: '很好的帖子！', createdAt: '2026-04-10' },
  { id: 2, author: '用户C', content: '学习了，谢谢分享！', createdAt: '2026-04-10' },
])
</script>

<template>
  <div class="post-detail">
    <article class="post-content">
      <h1>{{ post.title }}</h1>
      <div class="post-meta">
        <span>作者: {{ post.author }}</span>
        <span>发布时间: {{ post.createdAt }}</span>
        <span>浏览: {{ post.views }}</span>
        <span>点赞: {{ post.likes }}</span>
      </div>
      <div class="content">
        {{ post.content }}
      </div>
    </article>

    <section class="comments-section">
      <h2>评论 ({{ comments.length }})</h2>
      <div class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <span class="author">{{ comment.author }}</span>
            <span class="time">{{ comment.createdAt }}</span>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.post-detail {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.post-content h1 {
  margin-bottom: 16px;
}

.post-meta {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.content {
  line-height: 1.8;
  font-size: 16px;
}

.comments-section {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

.comments-section h2 {
  margin-bottom: 20px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-header .author {
  font-weight: bold;
}

.comment-header .time {
  color: #999;
  font-size: 12px;
}

.comment-content {
  margin: 0;
  color: #333;
}
</style>
