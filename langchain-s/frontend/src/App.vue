<template>
  <!-- 登录页面 -->
  <div v-if="!isLoggedIn" class="login-page">
    <div class="login-card">
      <div class="login-logo">
        <img src="./assets/AI.png" alt="Logo" class="login-logo-img" />
      </div>
      <h1 class="login-title">欢迎使用 AI 助手</h1>
      <p class="login-subtitle">请先登录后开始对话</p>

      <!-- 登录方式切换 -->
      <div class="login-tabs">
        <button 
          :class="['tab-btn', { active: loginMode === 'password' }]"
          @click="loginMode = 'password'"
        >
          账号密码
        </button>
        <button 
          :class="['tab-btn', { active: loginMode === 'token' }]"
          @click="loginMode = 'token'"
        >
          Token 登录
        </button>
      </div>

      <!-- 账号密码登录 -->
      <div v-show="loginMode === 'password'" class="login-form">
        <div class="form-group">
          <label class="form-label">账号</label>
          <input 
            v-model="loginForm.username" 
            type="text" 
            class="form-input"
            placeholder="请输入账号"
            @keydown.enter="handleLogin"
          />
        </div>
        <div class="form-group">
          <label class="form-label">密码</label>
          <input 
            v-model="loginForm.password" 
            type="password" 
            class="form-input"
            placeholder="请输入密码"
            @keydown.enter="handleLogin"
          />
        </div>
      </div>

      <!-- Token 登录 -->
      <div v-show="loginMode === 'token'" class="login-form">
        <div class="form-group">
          <label class="form-label">Token</label>
          <input 
            v-model="loginForm.token" 
            type="text" 
            class="form-input"
            placeholder="请输入 Token"
            @keydown.enter="handleLogin"
          />
        </div>
      </div>

      <button 
        class="login-btn"
        @click="handleLogin"
        :disabled="isLogging || !canLogin"
      >
        <span v-if="isLogging" class="loading-spinner"></span>
        {{ isLogging ? '登录中...' : '登录' }}
      </button>
    </div>
  </div>

  <!-- 主聊天页面 -->
  <div v-else class="app">
    <header class="app-header">
      <div class="header-left">
        <div class="logo">
          <img src="./assets/AI.png" alt="Logo" class="logo-icon" />
        </div>
        <span class="app-title">AI Assistant</span>
      </div>
      <div class="header-right">
        <div class="user-info">
          <span class="user-token" v-if="currentToken" :title="currentToken">
            {{ currentToken.slice(0, 6) }}***
          </span>
        </div>
        <button 
          class="btn-icon" 
          @click="logout" 
          title="退出登录"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"></path>
          </svg>
        </button>
        <button 
          v-if="messages.length > 1" 
          class="btn-icon" 
          @click="clearChat" 
          title="新对话"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
        </button>
      </div>
    </header>

    <main class="chat-container">
      <div class="messages" ref="messagesContainer">
        <div v-if="messages.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <path d="M8 10h.01M12 10h.01M16 10h.01"></path>
            </svg>
          </div>
          <p class="empty-text">开始对话吧</p>
        </div>

        <div 
          v-for="(msg, idx) in messages" 
          :key="idx"
          class="message-wrapper"
        >
          <div :class="['message', msg.role]">
            <div class="message-avatar">
              <svg v-if="msg.role === 'user'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a4 4 0 0 1 4 4v1h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z"></path>
              </svg>
            </div>
            <div class="message-content">
              <div class="message-role">{{ msg.role === 'user' ? '你' : '助手' }}</div>
              <div class="message-text" v-html="formatContent(msg.content)"></div>
            </div>
          </div>
        </div>

        <div v-if="isStreaming" class="message-wrapper">
          <div class="message assistant streaming">
            <div class="message-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a4 4 0 0 1 4 4v1h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z"></path>
              </svg>
            </div>
            <div class="message-content">
              <div class="message-role">助手</div>
              <div class="message-text">
                <span v-if="streamingContent">{{ streamingContent }}</span>
                <span class="cursor" v-else>▊</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="input-area">
        <div class="input-wrapper">
          <textarea 
            v-model="inputMessage" 
            @keydown.ctrl.enter="sendMessage"
            @keydown.enter.exact.prevent="sendMessage"
            placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
            :disabled="isStreaming"
            rows="1"
            ref="textareaRef"
          ></textarea>
          <button 
            @click="sendMessage" 
            :disabled="isStreaming || !inputMessage.trim()"
            class="send-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
            </svg>
          </button>
        </div>
      </div>
    </main>

    <footer class="app-footer">
      <span>LangChain + SSE 流式对话</span>
      <span class="status-dot" :class="{ online: true }"></span>
    </footer>
  </div>
</template>

<script setup>
import { ref, onUnmounted, nextTick, watch, computed } from 'vue'

// 登录相关状态
const loginMode = ref('password')
const loginForm = ref({
  username: '',
  password: '',
  token: ''
})
const isLogging = ref(false)
const isLoggedIn = ref(false)
const currentToken = ref(localStorage.getItem('auth_token') || '')

// 初始化登录状态
if (currentToken.value) {
  isLoggedIn.value = true
}

// 聊天相关状态
const messages = ref([])
const inputMessage = ref('')
const isStreaming = ref(false)
const streamingContent = ref('')
let abortController = null
const messagesContainer = ref(null)
const textareaRef = ref(null)

// 登录校验
const canLogin = computed(() => {
  if (loginMode.value === 'password') {
    return loginForm.value.username.trim() && loginForm.value.password.trim()
  }
  return loginForm.value.token.trim()
})

// 自动滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

watch(streamingContent, scrollToBottom)
watch(messages, scrollToBottom, { deep: true })

// 格式化消息内容，支持简单的 Markdown 样式
const formatContent = (content) => {
  if (!content) return ''
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

// 发送消息到后端
const sendToBackend = async (message, onSuccess) => {
  isStreaming.value = true
  streamingContent.value = ''
  
  abortController = new AbortController()
  
  try {
    const response = await fetch('http://localhost:8000/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message }),
      signal: abortController.signal
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      
      const lines = buffer.split('\n\n')
      buffer = lines.pop()

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6)
          try {
            const data = JSON.parse(dataStr)
            
            if (data.token) {
              streamingContent.value += data.token
            } else if (data.done) {
              onSuccess(streamingContent.value)
              streamingContent.value = ''
              isStreaming.value = false
            } else if (data.error) {
              throw new Error(data.error)
            }
          } catch (e) {
            console.error('解析SSE数据失败:', e, dataStr)
          }
        }
      }
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('请求已取消')
    } else {
      throw error
    }
    isStreaming.value = false
    streamingContent.value = ''
  } finally {
    abortController = null
  }
}

// 处理登录
const handleLogin = async () => {
  if (!canLogin.value || isLogging.value) return
  
  let message = ''
  if (loginMode.value === 'password') {
    message = `账号：${loginForm.value.username.trim()}，密码：${loginForm.value.password.trim()}，登录获取token`
  } else {
    message = `设置token：${loginForm.value.token.trim()}`
  }

  isLogging.value = true
  
  try {
    await sendToBackend(message, (result) => {
      currentToken.value = result
      localStorage.setItem('auth_token', result)
      isLoggedIn.value = true
    })
  } catch (error) {
    alert(`登录失败: ${error.message}`)
  } finally {
    isLogging.value = false
  }
}

// 发送消息并调用SSE流式接口
const sendMessage = async () => {
  const userMsg = inputMessage.value.trim()
  if (!userMsg || isStreaming.value) return

  messages.value.push({ role: 'user', content: userMsg })
  inputMessage.value = ''
  
  try {
    await sendToBackend(userMsg, (result) => {
      messages.value.push({ role: 'assistant', content: result })
    })
  } catch (error) {
    messages.value.push({ role: 'assistant', content: `错误: ${error.message}` })
    isStreaming.value = false
  }
}

// 清空对话
const clearChat = () => {
  messages.value = []
  streamingContent.value = ''
  isStreaming.value = false
  if (abortController) {
    abortController.abort()
    abortController = null
  }
}

// 退出登录
const logout = () => {
  isLoggedIn.value = false
  currentToken.value = ''
  localStorage.removeItem('auth_token')
  loginForm.value = { username: '', password: '', token: '' }
  clearChat()
}

onUnmounted(() => {
  if (abortController) {
    abortController.abort()
  }
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg-primary: #1a1b1e;
  --bg-secondary: #252628;
  --bg-tertiary: #2d2e30;
  --bg-hover: #323336;
  --border-color: #3a3b3e;
  --text-primary: #e4e5e7;
  --text-secondary: #9ca0a6;
  --text-muted: #6b7075;
  --accent: #7c6ef0;
  --accent-hover: #8b7ff8;
  --accent-light: rgba(124, 110, 240, 0.15);
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.3);
  --transition: all 0.2s ease;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-primary);
  background-image: radial-gradient(circle at 50% 50%, rgba(124, 110, 240, 0.03) 0%, transparent 50%);
}

/* ========== 登录页面 ========== */
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-primary);
  background-image: radial-gradient(circle at 50% 50%, rgba(124, 110, 240, 0.03) 0%, transparent 50%);
}

.login-card {
  width: 380px;
  padding: 40px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
}

.login-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.login-logo-img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
}

.login-title {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.login-subtitle {
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 28px;
}

/* 登录方式切换 */
.login-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: 4px;
}

.tab-btn {
  flex: 1;
  padding: 10px 16px;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
}

.tab-btn.active {
  background: var(--bg-secondary);
  color: var(--text-primary);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.tab-btn:hover:not(.active) {
  color: var(--text-primary);
}

/* 表单 */
.login-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 14px;
  transition: var(--transition);
  outline: none;
}

.form-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(124, 110, 240, 0.15);
}

.form-input::placeholder {
  color: var(--text-muted);
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  padding: 12px;
  background: var(--accent);
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-btn:hover:not(:disabled) {
  background: var(--accent-hover);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ========== 主应用 ========== */
.app {
  display: flex;
  flex-direction: column;
  max-width: 768px;
  width: 90vw;
  height: 85vh;
  margin: 0 auto;
  margin-top: 5vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.logo-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.app-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-token {
  font-size: 12px;
  color: var(--text-muted);
  padding: 4px 8px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.btn-icon:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

.btn-icon svg {
  width: 16px;
  height: 16px;
}

/* Chat Container */
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Messages */
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.messages::-webkit-scrollbar {
  width: 6px;
}

.messages::-webkit-scrollbar-track {
  background: transparent;
}

.messages::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.messages::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.empty-text {
  color: var(--text-secondary);
  font-size: 14px;
}

/* Message */
.message-wrapper {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message {
  display: flex;
  gap: 12px;
  max-width: 85%;
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  transition: var(--transition);
}

.message.user {
  background: var(--accent-light);
  border: 1px solid rgba(124, 110, 240, 0.2);
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.assistant {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  align-self: flex-start;
}

.message.streaming {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px rgba(124, 110, 240, 0.1);
}

.message-avatar {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.message.user .message-avatar {
  background: var(--accent);
  color: white;
}

.message-avatar svg {
  width: 16px;
  height: 16px;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-role {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.message-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-text code {
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  font-size: 13px;
}

.cursor {
  display: inline-block;
  color: var(--accent);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Input Area */
.input-area {
  padding: 16px 24px 20px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 8px 12px;
  transition: var(--transition);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1);
}

.input-wrapper:focus-within {
  border-color: var(--accent);
  box-shadow: 0 4px 16px rgba(124, 110, 240, 0.25), 0 0 0 2px rgba(124, 110, 240, 0.15);
}

textarea {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  padding: 8px 4px;
  max-height: 150px;
  font-family: inherit;
}

textarea::placeholder {
  color: var(--text-muted);
}

.send-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  border: none;
  border-radius: var(--radius-md);
  color: white;
  cursor: pointer;
  transition: var(--transition);
}

.send-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.send-btn svg {
  width: 18px;
  height: 18px;
}

/* Footer */
.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-muted);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-muted);
}

.status-dot.online {
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
}
</style>
