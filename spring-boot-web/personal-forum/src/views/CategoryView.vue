<!--
 * @FilePath: src/views/CategoryView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 分类页面
 * @LastEditTime: 2026-04-10
-->

<script setup lang="ts">
import { ref } from 'vue'

const categories = ref([
  { id: 1, name: '技术讨论', count: 128 },
  { id: 2, name: '生活闲聊', count: 56 },
  { id: 3, name: '问题求助', count: 34 },
  { id: 4, name: '资源分享', count: 89 },
])
</script>

<template>
  <div class="category-view">
    <h1>分类</h1>
    <div class="category-list">
      <div v-for="cat in categories" :key="cat.id" class="category-item">
        <h3>{{ cat.name }}</h3>
        <span>{{ cat.count }} 个帖子</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-view {
  padding: 20px;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.category-item {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
