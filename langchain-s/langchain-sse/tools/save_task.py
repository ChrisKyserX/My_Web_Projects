"""
 * @FilePath: langchain-sse/tools/save_task.py
 * @Author: chiwan
 * @Date: 2026-04-14
 * @Description: 工单保存工具
 * @LastEditTime: 2026-04-14
"""

import json
import requests
from langchain.tools import tool


# 固定入参
DEFAULT_PARAMS = {
    "appId": 43308,
    "taskId": -1,
    "projectId": 2092243,
    "type": "create",
    "hideCols": "[]",
    "autoMemoFlag": "0",
    "isCopyOpt": False,
    "ext": {"ext_ai_hide_col_ids": "[]"},
    "tempTime": 1776157756119
}

URL = "https://jxz-pre.bytenew.com/gateway/task/saveOrUpdateAppTask"


@tool
def save_task(content: str, token: str) -> str:
    """
    保存工单

    Args:
        content: 工单内容（JSON格式）
        token: 登录获取的token

    Returns:
        请求结果
    """
    print(f"[save_task] ========== 开始保存工单 ==========")
    print(f"[save_task] 原始content: {content}")
    print(f"[save_task] token: {token[:20]}..." if len(token) > 20 else f"[save_task] token: {token}")

    # 构建请求头
    headers = {
        "Content-Type": "application/json",
        "charset": "UTF-8",
        "plugin-token": token,
        "plugin-mobile": "15858194609"
    }

    # 合并固定入参和content
    print(f"[save_task] 步骤1: 处理content入参...")
    try:
        if isinstance(content, str):
            # 尝试解析JSON字符串
            try:
                content_json = json.loads(content)
                print(f"[save_task] content是JSON字符串，已解析: {json.dumps(content_json, ensure_ascii=False)[:100]}")
            except json.JSONDecodeError:
                # 如果不是JSON格式，包装成content字段
                content_json = {"content": content}
                print(f"[save_task] content不是JSON，包装为对象")
        elif isinstance(content, (dict, list)):
            # 已经是dict或list，直接使用
            content_json = content
            print(f"[save_task] content已是dict/list")
        else:
            # 其他类型转为字符串
            content_json = {"content": str(content)}
            print(f"[save_task] content转为字符串对象")

    except Exception as e:
        print(f"[save_task] content处理失败: {e}")
        return f"错误: content处理失败 - {str(e)}"

    # 构建请求参数
    print(f"[save_task] 步骤2: 构建请求参数...")
    request_params = DEFAULT_PARAMS.copy()
    request_params["content"] = content_json
    print(f"[save_task] 请求参数: {json.dumps(request_params, ensure_ascii=False)[:200]}...")

    print(f"[save_task] 步骤3: 发送请求...")
    print(f"[save_task] URL: {URL}")
    print(f"[save_task] Headers: {headers}")

    try:
        response = requests.post(URL, json=request_params, headers=headers, timeout=30)
        print(f"[save_task] 响应状态码: {response.status_code}")
        
        # 打印trace-id（可能在响应头中）
        trace_id = response.headers.get('X-Trace-Id') or response.headers.get('Trace-Id') or response.headers.get('trace-id')
        if trace_id:
            print(f"[save_task] Trace-ID: {trace_id}")
        
        response.raise_for_status()

        response_json = response.json()
        
        # 也检查响应体里的traceId
        trace_id_in_body = response_json.get('traceId') or response_json.get('trace_id') or response_json.get('trace-id')
        if trace_id_in_body:
            print(f"[save_task] Trace-ID(body): {trace_id_in_body}")
        
        print(f"[save_task] 响应内容: {json.dumps(response_json, ensure_ascii=False, indent=2)[:300]}")
        
        print(f"[save_task] ========== 保存完成 ==========")
        return json.dumps(response_json, ensure_ascii=False, indent=2)

    except requests.exceptions.Timeout:
        print(f"[save_task] 错误: 请求超时")
        return "错误: 请求超时"
    except requests.exceptions.RequestException as e:
        print(f"[save_task] 错误: 请求失败 - {str(e)}")
        return f"错误: 请求失败 - {str(e)}"
    except json.JSONDecodeError:
        print(f"[save_task] 错误: 响应解析失败")
        return f"错误: 响应解析失败"