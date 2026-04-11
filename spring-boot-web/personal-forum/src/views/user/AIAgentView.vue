<!--
 * @FilePath: src/views/user/AIAgentView.vue
 * @Author: chiwan
 * @Date: 2026-04-11
 * @Description: AI Agent对话页面
 * @LastEditTime: 2026-04-11
-->

<template>
  <div class="ai-agent-page">
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><ChatDotSquare /></el-icon>
        AI Agent
      </h1>
      <p class="page-desc">与AI助手进行对话</p>
    </div>

    <div class="chat-container">
      <!-- 聊天消息区域 -->
      <div class="messages-area" ref="messagesArea">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message-item"
          :class="{ 'user-message': message.role === 'user', 'ai-message': message.role === 'assistant' || message.role === 'reasoning_content' || message.role === 'tool' }"
        >
          <template v-if="message.role === 'reasoning_content'">
            <!-- <div class="message-avatar">
              <el-avatar
                :size="40"
                :icon="ChatDotSquare"
                :class="message.role"
              />
            </div> -->
            <div @click="message.bShow = !message.bShow" style="cursor: pointer;">推理内容</div>
            <div class="message-content m-c-anim" :class="message.bShow?'m-c-anim-show':''">
              <div class="message-text">{{ message.content }}</div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </template>
          <template v-else-if="message.role === 'tool'">
            <!-- <div class="message-avatar">
              <el-avatar
                :size="40"
                :icon="ChatDotSquare"
                :class="message.role"
              />
            </div> -->
            <div @click="message.bShow = !message.bShow" style="cursor: pointer;">工具调用</div>
            <div class="message-content m-c-anim" :class="message.bShow?'m-c-anim-show':''">
              <div class="message-text">{{ message.ext.toolInfo }}</div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </template>
          <template v-else>
            <div class="message-avatar">
              <el-avatar
                :size="40"
                :icon="message.role === 'user' ? User : ChatDotSquare"
                :class="message.role"
              />
            </div>
            <div class="message-content">
              <div class="message-text">{{ message.content }}</div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </template>
        </div>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="message-item ai-message">
          <div class="message-avatar">
            <el-avatar :size="40" :icon="ChatDotSquare" class="assistant" />
          </div>
          <div class="message-content">
            <el-icon class="loading-icon"><Loading /></el-icon>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="3"
          placeholder="请输入您的问题..."
          resize="none"
          @keyup.enter.ctrl="handleSendClick"
        />
        <div class="input-actions">
          <span class="hint">Ctrl + Enter 发送</span>
          <el-button
            type="primary"
            :icon="Promotion"
            :loading="isLoading"
            :disabled="!inputMessage.trim()"
            @click="handleSendClick"
          >
            发送
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OpenAI from 'openai';
import { ref } from 'vue'
import { ChatDotSquare, User, Promotion, Loading } from '@element-plus/icons-vue'

import { tools } from '@/utils/ai/tools'
import type { messageItem } from '@/utils/ai/do/message'
import type { functionCallsItem } from '@/utils/ai/do/functionCalls'
import { aiChat } from '@/api/ai/index'


interface Message {
  role: 'user' | 'assistant' | 'reasoning_content' | 'tool'
  content: string
  time: string,
  tool_call_id: String,
  ext: any
}

const inputMessage = ref('')
const isLoading = ref(false)
const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: '你好！我是AI助手，有什么可以帮助你的吗？',
    time: new Date().toLocaleTimeString()
  }
])

const handleSendClick = () => {
  try {
    const content = inputMessage.value.trim()
    if (!content || isLoading.value) return
    // 添加用户消息
    messages.value.push({
      role: 'user',
      content,
      time: new Date().toLocaleTimeString()
    })

    // 清空输入
    inputMessage.value = ''

    // 模拟AI回复
    isLoading.value = true

    let ms: messageItem[] = [{ role: "user", content: content }]

    handleSend(ms)
  } catch (error) {
    isLoading.value = false
  }
}

// 普通
const handleSends = async (ms: messageItem[]) => {

  try {
    // 第一次调用 意图识别
    let next: Boolean = false
    let params = {
      messages:ms,
      tools: tools
    }
    console.log('params',params);
    const res = await aiChat(params)
    console.log('res',res);
    if(res.success){
      // 是否使用工具
      if(res.message){
        // 添加AI消息
        messages.value.push({
          role: 'assistant',
          content: res.message,
          time: new Date().toLocaleTimeString()
        })
      }
      if(res.functionCalls?.length){
        res.functionCalls.map((i:functionCallsItem) =>{
          if(i.type === "function"){
            const addMs = handleFunction(i)
            if(addMs){
              ms.push({
                role: 'tool',
                tool_call_id: i.id,
                content: addMs
              })
              next = true
            }else{
              next = false
            }
          }
        })
      }
    }
    if(next){
      // 继续调用
      handleSend(ms)
    }else{
      isLoading.value = false
    }
    
  } catch (error) {
    // 
    console.log('===',error);
    
  }



  // const apiKey = import.meta.env.VITE_AI_API_KEY
  // const client = new OpenAI({
  //   apiKey: apiKey,
  //   baseURL: "https://coding.dashscope.aliyuncs.com/v1" // 用 DeepSeek 的话
  // });

  // const response = await client.chat.completions.create({
  //   model: "gpt-3.5-turbo",
  //   messages: [{ role: "user", content: content }],
  // });
  // console.log(response.choices[0].message.content);
  // setTimeout(() => {
  //   messages.value.push({
  //     role: 'assistant',
  //     content: '这是一个模拟的AI回复。实际应用中，这里会调用AI API获取真实回复。',
  //     time: new Date().toLocaleTimeString()
  //   })
  //   isLoading.value = false
  // }, 1000)
}

// 流式
const handleSend = async (ms: messageItem[]) => {
  try {
    // 第一次调用 意图识别
    let next: Boolean = false
    let params = {
      messages:ms,
      tools: tools
    }
    console.log('params',params);
    // "http://localhost:3000/agent/aiChat"
    const response = await fetch("/agent/aiChatSSE", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'  
      },
      body: JSON.stringify(params),
    });
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    while(true){
      const da = await reader?.read()
      console.log('==',da);
      const { done, value } = da
      if(done || !value) break
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6);
          let obj = undefined
          console.log('jsonStr',jsonStr);
          try {
            obj = JSON.parse(jsonStr);  // 转回对象
          } catch (error) {
            console.log('obj',obj);
            console.log('error',error);
          }
          console.log(obj);
          if(obj?.content){
            // 结果
            const lastIndex = messages.value.length - 1
            if(messages.value[lastIndex]?.role === 'assistant'){
              messages.value[lastIndex].content += obj.content
            }else{
              messages.value.push({
                role: 'assistant',
                content: obj.content,
                time: new Date().toLocaleTimeString()
              })
            }
          }else if(obj.reasoning_content){
            // 推理内容
            const lastIndex = messages.value.length - 1
            if(messages.value[lastIndex]?.role === 'reasoning_content'){
              messages.value[lastIndex].content += obj.reasoning_content
            }else{
              messages.value.push({
                role: 'reasoning_content',
                content: obj.reasoning_content,
                time: new Date().toLocaleTimeString()
              })
            }
          }else if(obj.tool_calls?.length){
            // 工具调用
            obj.tool_calls.map((i:functionCallsItem)=>{


              
              const lastIndex = messages.value.length - 1
              if(
                !messages.value[lastIndex] || 
                messages.value[lastIndex]?.role !== 'tool' ||
                (messages.value[lastIndex]?.role === 'tool' && i.function.name && i.id && messages.value[lastIndex]?.tool_call_id !== i.id)
              ){

                const addMs = handleFunction(i)
                if(addMs){
                  messages.value.push({
                    role: 'tool',
                    tool_call_id: i.id,
                    ext: {
                      toolInfo: `调用工具:${i.function.name}；类型:${i.type};`
                    },
                    content: addMs,
                    time: new Date().toLocaleTimeString()
                  })
                  next = true
                }else{
                  next = false
                }
              }
            })
          }else {
            // 其他
            console.log('other::',obj);
            if(obj.done){
              // 完成
              const lastIndex = messages.value.length - 1
              console.log('messages.value',messages.value);
              if(messages.value[lastIndex]?.role === "tool"){
                ms = messages.value.filter(i=>i.role !== 'reasoning_content').map(i=>{
                  return {
                    role: i.role,
                    content: i.content,
                    tool_call_id: i.tool_call_id || undefined,
                  }
                })
                next = true
              }
            }
          }
        }
      }
      
      // result += decoder.decode(value, { stream: true })
      // console.log('result',JSON.stringify(result));
    }
    if(next){
      // 继续调用
      handleSend(ms)
    }else{
      isLoading.value = false
    }
    
  } catch (error) {
    console.log('===',error);
  }
}

const handleFunction = (i: any) => {
    const params = (i.function.arguments && typeof i.function.arguments === 'string') ? JSON.parse(i.function.arguments) : i.function.arguments ||''
    switch (i.function.name) {
    case "get_weather":
      return getWearch(params)
    case "get_time":
      return getTime()
    default:
      console.log('未识别工具调用'+JSON.stringify(i));
      return ""
  }
}

interface waerchParams{
  city: string
}
const getWearch = (params: waerchParams)=>{
  return params?.city+"的天气是晴天"
}

const getTime = ()=>{
  return new Date().toLocaleTimeString()
}
</script>

<style scoped lang="scss">
.ai-agent-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
  text-align: center;

  .page-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-size: 28px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;

    .el-icon {
      color: var(--primary-color);
    }
  }

  .page-desc {
    color: var(--text-secondary);
    font-size: 14px;
  }
}

.chat-container {
  background: var(--bg-overlay);
  border-radius: var(--radius-large);
  border: 1px solid var(--border-light);
  overflow: hidden;
}

.messages-area {
  min-height: 400px;
  max-height: 500px;
  overflow-y: auto;
  padding: 20px;
  background: var(--bg-page);
}

.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;

  &.user-message {
    flex-direction: row-reverse;

    .message-content {
      align-items: flex-end;

      .message-text {
        background: var(--primary-color);
        color: #fff;
        border-radius: 12px 12px 4px 12px;
      }
    }
  }

  &.ai-message {
    .message-text {
      background: var(--bg-overlay);
      color: var(--text-primary);
      border-radius: 12px 12px 12px 4px;
    }
  }
}

.message-avatar {
  .el-avatar {
    background: var(--primary-light);
    color: var(--primary-color);

    &.assistant {
      background: var(--success-light);
      color: var(--success-color);
    }
  }
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 70%;
}

.message-text {
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
  box-shadow: var(--shadow-light);
}

.message-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.loading-icon {
  font-size: 20px;
  color: var(--primary-color);
  animation: rotate 1s linear infinite;
}

.input-area {
  padding: 20px;
  border-top: 1px solid var(--border-light);
  background: var(--bg-overlay);

  :deep(.el-textarea__inner) {
    background: var(--bg-page);
    border-color: var(--border-light);
    resize: none;

    &:focus {
      border-color: var(--primary-color);
    }
  }
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;

  .hint {
    font-size: 12px;
    color: var(--text-secondary);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .ai-agent-page {
    padding: 16px;
  }

  .message-content {
    max-width: 85%;
  }

  .messages-area {
    min-height: 300px;
    max-height: 400px;
  }
}

.m-c-anim{
  max-height: 0;
  transition: all 0.3s ease;
  overflow: hidden;
}
.m-c-anim-show{
  max-height: 300px;
  padding: 10px 10px 0 10px;
  overflow: auto;
}
</style>
