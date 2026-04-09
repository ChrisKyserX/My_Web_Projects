<!--
 * @FilePath: src/views/UserProfileView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 用户主页
 * @LastEditTime: 2026-04-10
-->

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = route.params.id

const user = ref({
  id: userId,
  name: '用户' + userId,
  avatar: '',
  bio: '这个人很懒，什么都没有写...',
  posts: 12,
  followers: 34,
  following: 56,
})

const recentPosts = ref([
  { id: 1, title: '我的第一篇帖子', createdAt: '2026-04-09' },
  { id: 2, title: '分享一些学习心得', createdAt: '2026-04-08' },
])
</script>

<template>
  <div class="user-profile">
    <div class="profile-header">
      <div class="avatar">
        <img v-if="user.avatar" :src="user.avatar" :alt="user.name">
        <div v-else class="avatar-placeholder">{{ user.name[0] }}</div>
      </div>
      <div class="profile-info">
        <h1>{{ user.name }}</h1>
        <p class="bio">{{ user.bio }}</p>
        <div class="stats">
          <span>帖子: {{ user.posts }}</span>
          <span>关注者: {{ user.followers }}</span>
          <span>关注: {{ user.following }}</span>
        </div>
      </div>
    </div>

    <section class="recent-posts">
      <h2>最近发布的帖子</h2>
      <div class="posts-list">
        <div v-for="post in recentPosts" :key="post.id" class="post-item">
          <h3>{{ post.title }}</h3>
          <span class="time">{{ post.createdAt }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.user-profile {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: #f5f5f5;
  border-radius: 12px;
  margin-bottom: 32px;
}

.avatar {
  width: 100px;
  height: 100px;
}

.avatar img,
.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #409eff;
  color: white;
  font-size: 36px;
  font-weight: bold;
}

.profile-info h1 {
  margin: 0 0 8px 0;
}

.bio {
  color: #666;
  margin: 0 0 16px 0;
}

.stats {
  display: flex;
  gap: 24px;
}

.stats span {
  color: #333;
}

.recent-posts h2 {
  margin-bottom: 16px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.post-item h3 {
  margin: 0;
  color: #409eff;
}

.post-item .time {
  color: #999;
  font-size: 14px;
}
</style>
