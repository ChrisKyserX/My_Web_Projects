"""
 * @FilePath: langchain-sse/services/llm_service.py
 * @Author: chiwan
 * @Date: 2026-04-14
 * @Description: LLM服务 - 工具调用 + 短期记忆
 * @LastEditTime: 2026-04-14
"""

import asyncio
import json
import re
import warnings
from typing import AsyncGenerator, List, Dict, Any
from datetime import datetime

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from langchain_core.tools import tool
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

# 忽略弃用警告
warnings.filterwarnings("ignore", category=DeprecationWarning)

from config import settings, app_config
from tools import get_all_tools


# 内存存储
_session_histories: Dict[str, ChatMessageHistory] = {}


def get_session_history(session_id: str) -> BaseChatMessageHistory:
    """获取会话历史（短期记忆）"""
    if session_id not in _session_histories:
        _session_histories[session_id] = ChatMessageHistory()
    return _session_histories[session_id]


class AgentLLMService:
    """
    LLM服务 - 使用LangChain工具调用
    支持短期记忆功能
    """

    SYSTEM_PROMPT = """你是一个智能助手，可以用工具来帮助用户解决问题。

你可以使用的工具：
{tools}

请用中文回复用户的问题。"""

    def __init__(self):
        self.api_key = settings.DASHSCOPE_API_KEY
        self.base_url = settings.LLM_BASE_URL
        self.model = settings.LLM_MODEL
        self.langchain_available = app_config.LANGCHAIN_AVAILABLE

        self.tools = get_all_tools()
        self._init_llm()

    def _init_llm(self):
        """初始化LLM模型"""
        if self.langchain_available and self.api_key:
            try:
                self.llm = ChatOpenAI(
                    api_key=self.api_key,
                    base_url=self.base_url,
                    model=self.model,
                    streaming=True,
                    temperature=0.7,
                )
                # 尝试绑定工具（LangChain 0.3.x兼容方式）
                try:
                    self.llm_with_tools = self.llm.bind_tools(self.tools)
                    print(f"[AgentLLMService] 绑定工具成功，工具数量: {len(self.tools)}")
                except Exception as e:
                    print(f"[AgentLLMService] bind_tools失败: {e}")
                    self.llm_with_tools = None
            except Exception as e:
                print(f"[AgentLLMService] LLM初始化失败: {e}")
                import traceback
                traceback.print_exc()
                self.llm = None
                self.llm_with_tools = None
        else:
            print("[AgentLLMService] LangChain不可用或无API Key")
            self.llm = None
            self.llm_with_tools = None

    async def chat_with_memory(
        self,
        message: str,
        session_id: str = "default",
        enable_stream: bool = True,
        max_tool_rounds: int = 10  # 最多工具调用轮次
    ) -> AsyncGenerator[str, None]:
        """带短期记忆的对话，支持多轮工具调用"""
        if not self.llm_with_tools:
            print(f"[AgentLLMService] llm_with_tools为空，使用模拟模式")
            async for chunk in self._mock_stream(message, session_id):
                yield chunk
            return

        print(f"[AgentLLMService] 开始处理: {message}")

        try:
            chat_history = get_session_history(session_id)

            # 构建消息列表
            messages = self._build_messages(message, chat_history)

            # 多轮工具调用循环
            tool_round = 0
            final_output = None

            while tool_round < max_tool_rounds:
                tool_round += 1
                print(f"[AgentLLMService] ===== 第{tool_round}轮调用 =====")

                # 调用LLM检查是否需要工具
                print(f"[AgentLLMService] 调用LLM...")
                response = await self.llm_with_tools.ainvoke(messages)
                print(f"[AgentLLMService] LLM响应: {response.content[:200] if response.content else 'None'}")

                # 检查工具调用
                tool_calls = getattr(response, 'tool_calls', [])
                print(f"[AgentLLMService] 工具调用数量: {len(tool_calls)}")

                if not tool_calls:
                    # 没有工具调用，说明LLM可以直接回答了
                    final_output = response.content
                    print(f"[AgentLLMService] 无工具调用，使用LLM回复")
                    messages.append(response)
                    break

                # 执行工具
                tool_names = [tc.get('name') for tc in tool_calls]
                print(f"[AgentLLMService] 执行工具: {tool_names}")

                tool_messages = await self._execute_tools(tool_calls)

                # 添加到消息列表
                messages.append(response)
                messages.extend(tool_messages)

                # 继续下一轮，让LLM根据工具结果决定下一步

            # 如果达到最大轮次还没结束
            if tool_round >= max_tool_rounds:
                final_output = f"已达到最大工具调用次数({max_tool_rounds})，请检查流程"
                print(f"[AgentLLMService] 达到最大轮次: {final_output}")

            # 保存到记忆
            if final_output:
                chat_history.add_user_message(message)
                chat_history.add_ai_message(final_output)

            # 流式输出
            if enable_stream:
                if not final_output:
                    final_output = "抱歉，没有获取到有效回复"
                chunks = self._split_content(final_output)
                for chunk in chunks:
                    yield f"data: {json.dumps({'token': chunk})}\n\n"
                    await asyncio.sleep(0.05)

            yield f"data: {json.dumps({'done': True, 'session_id': session_id, 'tool_rounds': tool_round})}\n\n"

        except Exception as e:
            error_msg = f"执行错误: {str(e)}"
            import traceback
            traceback.print_exc()
            yield f"data: {json.dumps({'error': error_msg})}\n\n"

    def _build_messages(self, message: str, chat_history: ChatMessageHistory) -> List:
        """构建消息列表"""
        tools_str = "\n".join([
            f"- {t.name}: {t.description}" for t in self.tools
        ])

        messages = [
            ("system", self.SYSTEM_PROMPT.replace("{tools}", tools_str))
        ]

        # 添加历史消息
        for msg in chat_history.messages[-10:]:
            if isinstance(msg, HumanMessage):
                messages.append(HumanMessage(content=msg.content))
            elif isinstance(msg, AIMessage):
                messages.append(AIMessage(content=msg.content))

        messages.append(HumanMessage(content=message))

        return messages

    async def _execute_tools(self, tool_calls: List[Dict]) -> List[ToolMessage]:
        """执行工具调用"""
        tool_messages = []

        for tool_call in tool_calls:
            tool_name = tool_call.get("name", "")
            tool_args = tool_call.get("args", {})
            
            print(f"[AgentLLMService] 工具入参 - {tool_name}: {tool_args}")

            # 查找工具
            selected_tool = None
            for t in self.tools:
                if t.name == tool_name:
                    selected_tool = t
                    break

            if selected_tool:
                try:
                    result = selected_tool.invoke(tool_args)
                    print(f"[AgentLLMService] 工具返回: {str(result)[:100]}...")
                    tool_messages.append(
                        ToolMessage(
                            content=str(result),
                            tool_call_id=tool_call.get("id", "unknown")
                        )
                    )
                except Exception as e:
                    tool_messages.append(
                        ToolMessage(
                            content=f"工具执行错误: {str(e)}",
                            tool_call_id=tool_call.get("id", "unknown")
                        )
                    )

        return tool_messages

    def _split_content(self, content: str) -> List[str]:
        """将内容分割成适合流式输出的片段"""
        pattern = r'[^。？！.?!]*[。？！.?!]?'
        matches = re.findall(pattern, content)

        result = []
        for m in matches:
            m = m.strip()
            if m:
                if len(m) > 20:
                    for i in range(0, len(m), 10):
                        result.append(m[i:i+10])
                else:
                    result.append(m)

        return result if result else [content]

    async def _mock_stream(self, message: str, session_id: str = "default") -> AsyncGenerator[str, None]:
        """模拟流式输出（降级方案）"""
        mock_reply = f"[模拟模式] 您的问题是: '{message}'。\n\n当前LLM不可用，这是模拟回复。"

        chat_history = get_session_history(session_id)
        chat_history.add_user_message(message)
        chat_history.add_ai_message(mock_reply)

        for char in mock_reply:
            yield f"data: {json.dumps({'token': char})}\n\n"
            await asyncio.sleep(0.03)

        yield f"data: {json.dumps({'done': True, 'session_id': session_id, 'mock': True})}\n\n"

    async def generate_stream(self, message: str, session_id: str = "default") -> AsyncGenerator[str, None]:
        """生成SSE流式数据"""
        async for chunk in self.chat_with_memory(message, session_id):
            yield chunk

    def clear_session(self, session_id: str):
        """清除会话历史"""
        if session_id in _session_histories:
            del _session_histories[session_id]
            return True
        return False


# 全局服务实例
agent_service = AgentLLMService()


async def stream_generator(message: str, session_id: str = "default") -> AsyncGenerator[str, None]:
    """生成SSE流式数据"""
    async for chunk in agent_service.generate_stream(message, session_id):
        yield chunk


def get_chat_history(session_id: str = "default") -> List[Dict]:
    """获取指定会话的历史记录"""
    history = get_session_history(session_id)
    return [
        {
            "type": "human" if isinstance(m, HumanMessage) else "ai",
            "content": m.content,
            "timestamp": datetime.now().isoformat()
        }
        for m in history.messages
    ]


def clear_chat_history(session_id: str = "default") -> bool:
    """清除指定会话的历史记录"""
    return agent_service.clear_session(session_id)


def get_session_list() -> List[str]:
    """获取所有会话ID列表"""
    return list(_session_histories.keys())