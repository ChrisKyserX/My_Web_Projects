<template>
  <div class="container">
    <h1>LangChain + SSE 流式对话</h1>
    <div class="chat-box">
      <div class="messages">
        <div 
          v-for="(msg, idx) in messages" 
          :key="idx"
          :class="['message', msg.role]"
        >
          <div class="role">{{ msg.role === 'user' ? '用户' : '助手' }}</div>
          <div class="content">{{ msg.content }}</div>
        </div>
        <div v-if="isStreaming" class="message assistant streaming">
          <div class="role">助手（流式输出中...）</div>
          <div class="content">{{ streamingContent }}</div>
        </div>
      </div>
      <div class="input-area">
        <textarea 
          v-model="inputMessage" 
          @keydown.ctrl.enter="sendMessage"
          placeholder="输入消息... (Ctrl+Enter 发送)"
          :disabled="isStreaming"
        ></textarea>
        <button @click="sendMessage" :disabled="isStreaming || !inputMessage.trim()">
          {{ isStreaming ? '接收中...' : '发送' }}
        </button>
      </div>
    </div>
    <div class="info">
      <p>✅ 后端API: POST /chat/stream (SSE流式) | POST /chat (普通REST)</p>
      <p>💡 提示: 配置环境变量 OPENAI_API_KEY 可使用真实模型，否则为模拟流式输出</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const messages = ref([
  { role: 'assistant', content: '你好！我是使用LangChain的AI助手，支持流式输出。发送消息试试吧！' }
])
const inputMessage = ref('')
const isStreaming = ref(false)
const streamingContent = ref('')
let abortController = null

// 发送消息并调用SSE流式接口
const sendMessage = async () => {
  const userMsg = inputMessage.value.trim()
  if (!userMsg || isStreaming.value) return

  // 添加用户消息
  messages.value.push({ role: 'user', content: userMsg })
  inputMessage.value = ''
  
  // 重置流式状态
  isStreaming.value = true
  streamingContent.value = ''
  
  // 准备请求
  abortController = new AbortController()
  
  try {
    const response = await fetch('http://localhost:8000/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMsg }),
      signal: abortController.signal
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 处理流式响应（SSE格式）
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      // 解码数据块
      buffer += decoder.decode(value, { stream: true })
      
      // 按行分割SSE消息（每个事件以 \n\n 结尾）
      const lines = buffer.split('\n\n')
      buffer = lines.pop() // 保留不完整的部分

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6)
          try {
            const data = JSON.parse(dataStr)
            console.log('data',data);
            
            if (data.token) {
              streamingContent.value += data.token
            } else if (data.done) {
              // 流式结束，将完整内容添加到消息列表
              messages.value.push({ role: 'assistant', content: streamingContent.value })
              streamingContent.value = ''
              isStreaming.value = false
            } else if (data.error) {
              console.error('SSE错误:', data.error)
              messages.value.push({ role: 'assistant', content: `错误: ${data.error}` })
              isStreaming.value = false
              streamingContent.value = ''
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
      console.error('请求失败:', error)
      messages.value.push({ role: 'assistant', content: `网络错误: ${error.message}` })
    }
    isStreaming.value = false
    streamingContent.value = ''
  } finally {
    abortController = null
  }
}

// 组件卸载时取消正在进行的请求
onUnmounted(() => {
  if (abortController) {
    abortController.abort()
  }
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
}

.chat-box {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: #f9f9f9;
}

.messages {
  height: 500px;
  overflow-y: auto;
  padding: 20px;
  background: white;
}

.message {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  max-width: 85%;
}

.message.user {
  background: #007bff;
  color: white;
  margin-left: auto;
  text-align: right;
}

.message.assistant {
  background: #e9ecef;
  color: #212529;
  margin-right: auto;
}

.message.streaming {
  background: #f1f3f5;
  border-left: 3px solid #28a745;
}

.role {
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 6px;
  opacity: 0.8;
}

.content {
  word-wrap: break-word;
  white-space: pre-wrap;
}

.input-area {
  display: flex;
  padding: 16px;
  background: white;
  border-top: 1px solid #ddd;
  gap: 12px;
}

textarea {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
}

button {
  padding: 10px 24px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

button:hover:not(:disabled) {
  background: #218838;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.info {
  margin-top: 20px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
  color: #495057;
}

.info p {
  margin: 6px 0;
}
</style>