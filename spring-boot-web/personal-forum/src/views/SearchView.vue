<!--
 * @FilePath: src/views/SearchView.vue
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 搜索结果页面
 * @LastEditTime: 2026-04-10
-->

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const keyword = ref(route.query.q || '')

const searchResults = ref([
  { id: 1, title: '搜索结果 1', summary: '这是搜索结果的摘要内容...' },
  { id: 2, title: '搜索结果 2', summary: '这是搜索结果的摘要内容...' },
])
</script>

<template>
  <div class="search-view">
    <h1>搜索结果</h1>
    <p v-if="keyword" class="search-keyword">关键词: {{ keyword }}</p>
    <div class="results-list">
      <div v-for="result in searchResults" :key="result.id" class="result-item">
        <h3>{{ result.title }}</h3>
        <p>{{ result.summary }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-view {
  padding: 20px;
}

.search-keyword {
  color: #666;
  margin-bottom: 20px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.result-item h3 {
  margin: 0 0 8px 0;
  color: #409eff;
}

.result-item p {
  margin: 0;
  color: #666;
}
</style>
