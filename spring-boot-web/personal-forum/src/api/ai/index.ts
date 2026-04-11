/**
 * @FilePath: src/api/user.ts
 * @Author: chiwan
 * @Date: 2026-04-10
 * @Description: 用户相关API接口
 * @LastEditTime: 2026-04-10
 */

import { http } from '@/utils/requestAi'

import type { tool } from '@/utils/ai/do/tools'
import type { messageItem } from '@/utils/ai/do/message'

export interface aiChatParams {
  messages: messageItem[]
  tools: tool[]
}

/**
 * 用户注册
 * @param params 注册参数
 * @returns Promise
 */
export const aiChat = (params: aiChatParams) => {
  return http.post('/aiChat', params)
}
