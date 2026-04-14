"""
 * @FilePath: langchain-sse/tools/search.py
 * @Author: chiwan
 * @Date: 2026-04-14
 * @Description: LangChain搜索工具
 * @LastEditTime: 2026-04-14
"""

from typing import List
from langchain.tools import tool


# 模拟知识库
_MOCK_DATABASE = {
    "python": ["Python是一种高级编程语言", "Python支持面向对象编程"],
    "fastapi": ["FastAPI是高性能Python Web框架", "FastAPI支持异步处理"],
    "sse": ["SSE是Server-Sent Events的缩写", "SSE用于服务器向客户端推送数据"],
    "langchain": ["LangChain是LLM应用开发框架", "LangChain支持工具调用"],
}


@tool
def knowledge_search(query: str, limit: int = 3) -> str:
    """
    从知识库搜索相关信息

    Args:
        query: 搜索关键词
        limit: 返回结果数量，默认3条

    Returns:
        搜索结果列表
    """
    results = []
    query_lower = query.lower()

    for key, values in _MOCK_DATABASE.items():
        if query_lower in key or any(query_lower in v.lower() for v in values):
            results.extend(values)

    results = results[:limit]

    if not results:
        return f"未找到与'{query}'相关的内容"

    return "\n".join([f"- {r}" for r in results])


@tool
def web_search_mock(query: str) -> str:
    """
    模拟网络搜索（实际项目中替换为真实搜索API）

    Args:
        query: 搜索关键词

    Returns:
        模拟搜索结果
    """
    return f"[模拟搜索结果] 关于'{query}'的搜索:\n1. 结果示例1\n2. 结果示例2\n3. 结果示例3"
