"""
 * @FilePath: langchain-sse/tools/user_info.py
 * @Author: chiwan
 * @Date: 2026-04-14
 * @Description: Token获取工具
 * @LastEditTime: 2026-04-14
"""

import json
import requests
from typing import Optional
from langchain.tools import tool


# 默认账号
DEFAULT_MOBILE = "15858194609"
DEFAULT_PASSWORD = "Bn123456"


@tool
def get_token(mobile: str = None, password: str = None) -> str:
    """
    获取登录Token

    Args:
        mobile: 手机号，默认为预设账号
        password: 密码，默认为预设密码

    Returns:
        登录Token或错误信息
    """
    if not mobile:
        mobile = DEFAULT_MOBILE
    if not password:
        password = DEFAULT_PASSWORD

    url = "https://jxz-pre.bytenew.com/gateway/login/own/plugin"
    headers = {
        "Content-Type": "application/json",
        "charset": "UTF-8"
    }
    payload = {
        "mobile": mobile,
        "password": password
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()

        response_json = response.json()
        token = response_json.get('data')

        if token:
            return f"登录成功！\nToken: {token}"
        else:
            return json.dumps(response_json, ensure_ascii=False, indent=2)

    except requests.exceptions.Timeout:
        return "错误: 请求超时，请稍后重试"
    except requests.exceptions.RequestException as e:
        return f"错误: 请求失败 - {str(e)}"
    except json.JSONDecodeError:
        return f"错误: 响应解析失败 - {response.text[:200]}"


@tool
def get_token_with_code(mobile: str = None, password: str = None, verify_code: str = None) -> str:
    """
    带验证码的Token获取

    Args:
        mobile: 手机号
        password: 密码
        verify_code: 验证码（如果需要）

    Returns:
        登录Token或错误信息
    """
    if not mobile:
        mobile = DEFAULT_MOBILE
    if not password:
        password = DEFAULT_PASSWORD

    url = "https://jxz-pre.bytenew.com/gateway/login/own/plugin"
    headers = {
        "Content-Type": "application/json",
        "charset": "UTF-8"
    }
    payload = {
        "mobile": mobile,
        "password": password
    }

    if verify_code:
        headers["X-Verify-Code"] = verify_code

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()

        response_json = response.json()
        token = response_json.get('data')

        if token:
            return f"登录成功！\nToken: {token}"
        else:
            return json.dumps(response_json, ensure_ascii=False, indent=2)

    except requests.exceptions.Timeout:
        return "错误: 请求超时"
    except requests.exceptions.RequestException as e:
        return f"错误: 请求失败 - {str(e)}"
    except json.JSONDecodeError:
        return f"错误: 响应解析失败"