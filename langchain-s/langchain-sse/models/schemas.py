"""
 * @FilePath: langchain-sse/models/schemas.py
 * @Author: chiwan
 * @Date: 2026-04-14
 * @Description: Pydantic数据模型定义
 * @LastEditTime: 2026-04-14
"""

from pydantic import BaseModel


class ChatRequest(BaseModel):
    """聊天请求参数"""
    message: str


class ChatResponse(BaseModel):
    """聊天响应参数"""
    reply: str
