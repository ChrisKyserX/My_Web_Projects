"""
 * @FilePath: langchain-sse/tools/task.py
 * @Author: chiwan
 * @Date: 2026-04-14
 * @Description: 工作表组件列表获取工具
 * @LastEditTime: 2026-04-14
"""

import json
import requests
from langchain.tools import tool


# 固定入参
DEFAULT_PARAMS = {
    "appId": 43308,
    "projectId": 2092243,
    "taskId": "",
    "type": "create"
}

URL = "https://jxz-pre.bytenew.com/gateway/task/getTaskDetail"


@tool
def get_task_columns() -> str:
    """
    获取工作表组件列表

    Returns:
        组件列表数组 [{name, id, type, value:''}] 或错误信息
    """
    headers = {
        "Content-Type": "application/json",
        "charset": "UTF-8"
    }
    
    print(f"[get_task_columns] 入参: {json.dumps(DEFAULT_PARAMS, ensure_ascii=False)}")
    print(f"[get_task_columns] Headers: {headers}")

    try:
        response = requests.post(URL, json=DEFAULT_PARAMS, headers=headers, timeout=30)
        response.raise_for_status()

        response_json = response.json()
        data = response_json.get('data')

        if not data:
            return f"错误: 无数据返回\n{json.dumps(response_json, ensure_ascii=False, indent=2)}"

        # 获取columnList
        column_list = data[0].columnList
        print(f"[get_task_columns] column_list: {column_list}")

        # 处理成指定格式
        result_list = []
        for item in column_list:
            result_list.append({
                "name": item.get("name", ""),
                "id": item.get("id", ""),
                "type": item.get("type", ""),
                "value": ""
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


@tool
def get_task_columns_with_token(token: str) -> str:
    """
    使用token获取工作表组件列表

    Args:
        token: 登录获取的token

    Returns:
        组件列表数组或错误信息
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

        column_list = data[0].get('columnList', [])
        # print(f"[get_task_columns_with_token] column_list: {column_list}")

        result_list = []
        for item in column_list:
            result_list.append({
                "name": item.get("name", ""),
                "id": item.get("id", ""),
                "type": item.get("behaviorType", ""),
                "value": ""
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