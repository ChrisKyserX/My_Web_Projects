import os
import json
import asyncio
from typing import AsyncGenerator, Optional
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# 加载环境变量（ BAILIAN_API_KEY ）
# load_dotenv()

DASHSCOPE_API_KEY = os.getenv("DASHSCOPE_API_KEY")
print(f"DASHSCOPE_API_KEY: {DASHSCOPE_API_KEY}")
# for key, value in os.environ.items():
#     print(f"{key} = {value}")

# 尝试导入LangChain组件
try:
    from langchain_community.chat_models  import ChatOpenAI
    from langchain_core.messages import HumanMessage

    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False
    print("警告: LangChain-Community集成未安装，将使用模拟流式响应")

app = FastAPI(title="LangChain SSE Demo")

# 配置CORS（允许前端跨域调用）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境请指定具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 定义请求参数类型
class ChatRequest(BaseModel):
    message: str

# 定义响应参数类型
class ChatResponse(BaseModel):
    reply: str
    

# 生成SSE数据
async def stream_generator(message: str) -> AsyncGenerator[str, None]:
    """
    生成SSE格式的流式数据
    每个数据块格式: data: {"token": "文本片段"}\n\n
    """
    # 尝试使用真实LangChain流式（如果配置了OpenAI）
    if LANGCHAIN_AVAILABLE and DASHSCOPE_API_KEY:
        try:
            llm = ChatOpenAI(
                api_key=DASHSCOPE_API_KEY,
                base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
                model="qwen3.6-plus",
                streaming=True,  # 启用流式
                # temperature=0.7, # 温度
            )
            # 使用astream方法逐token输出
            async for chunk in llm.astream([HumanMessage(content=message)]):
                if chunk.content:
                    yield f"data: {json.dumps({'token': chunk.content})}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"
        except Exception as e:
            error_msg = f"流式生成出错: {str(e)}"
            yield f"data: {json.dumps({'error': error_msg})}\n\n"
    else:
        # 模拟流式输出（逐字输出，适合演示）
        mock_reply = f"[模拟流式] 您的问题是: '{message}'。这是一个通过SSE逐步输出的演示文本。"
        for char in mock_reply:
            yield f"data: {json.dumps({'token': char})}\n\n"
            await asyncio.sleep(0.05)  # 模拟逐字延迟
        yield f"data: {json.dumps({'done': True})}\n\n"

# SSE流式API
@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """SSE流式API，逐步返回回复内容"""
    return StreamingResponse(
        stream_generator(request.message),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # 禁用nginx缓冲
        }
    )

# 健康检查
@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)