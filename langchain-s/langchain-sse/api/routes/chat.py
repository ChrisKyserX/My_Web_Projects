"""
 * @FilePath: langchain-sse/api/routes/chat.py
 * @Author: chiwan
 * @Date: 2026-04-14
 * @Description: 聊天API路由 - 支持ReAct Agent和短期记忆
 * @LastEditTime: 2026-04-14
"""

from typing import Optional

from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse

from models.schemas import ChatRequest
from services.llm_service import (
    stream_generator,
    get_chat_history,
    clear_chat_history,
    get_session_list,
)

router = APIRouter()


@router.post("/stream")
async def chat_stream(
    request: ChatRequest,
    session_id: str = Query(default="default", description="会话ID，用于区分不同用户的对话历史")
):
    """
    SSE流式聊天API
    - 使用ReAct Agent自动决定是否调用工具
    - 支持短期记忆（按session_id隔离）
    """
    return StreamingResponse(
        stream_generator(request.message, session_id=session_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@router.get("/history")
async def get_history(session_id: str = Query(default="default")):
    """
    获取会话历史记录
    """
    history = get_chat_history(session_id)
    return {
        "session_id": session_id,
        "count": len(history),
        "messages": history
    }


@router.delete("/history")
async def clear_history(session_id: str = Query(default="default")):
    """
    清除会话历史记录
    """
    success = clear_chat_history(session_id)
    return {
        "success": success,
        "session_id": session_id
    }


@router.get("/sessions")
async def list_sessions():
    """
    获取所有会话列表
    """
    sessions = get_session_list()
    return {
        "count": len(sessions),
        "sessions": sessions
    }