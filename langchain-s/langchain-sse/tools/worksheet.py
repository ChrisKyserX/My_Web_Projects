"""
 * @FilePath: langchain-sse/tools/worksheet.py
 * @Author: chiwan
 * @Date: 2026-04-15
 * @Description: 获取工作表列表工具
 * @LastEditTime: 2026-04-15
"""

import json
import requests
from langchain.tools import tool

# 固定入参
DEFAULT_PARAMS = {
    "filterGroup": 0,
    "projectType": 0,
    "showAll": 1,
}

URL = "https://jxz-pre.bytenew.com/gateway/project/getAppGroupList"

@tool
def get_worksheet_list(token: str) -> str:
    """
    获取工作表列表

    Args:
        token: 登录获取的token

    Returns:
        工作表列表或错误信息
    """
    headers = {
        "Content-Type": "application/json",
        "charset": "UTF-8",
        "plugin-token": f"{token}"
    }
    
    # print(f"[get_task_columns_with_token] 入参: {json.dumps(DEFAULT_PARAMS, ensure_ascii=False)}")
    # print(f"[get_task_columns_with_token] Headers: {headers}")

    try:
        response = requests.post(URL, json=DEFAULT_PARAMS, headers=headers, timeout=30)
        response.raise_for_status()

        response_json = response.json()
        data = response_json.get('data')
        # print(f"[get_task_columns_with_token] data: {data}")

        if not data:
            return f"错误: 无数据返回\n{json.dumps(response_json, ensure_ascii=False, indent=2)}"

        result_list = []
        for item in data:
            result_list.append({
                "title": item.get("title", ""),
                "id": item.get("id", ""),
            })

        return json.dumps(result_list, ensure_ascii=False, indent=2)

    except requests.exceptions.Timeout:
        return "错误: 请求超时"
    except requests.exceptions.RequestException as e:
        return f"错误: 请求失败 - {str(e)}"
    except (KeyError, IndexError, TypeError) as e:
        return f"错误: 数据解析失败 - {str(e)}"
    except json.JSONDecodeError:
        return f"错误: 响应解析失败"