@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 检查参数
if "%~1"=="" (
    echo 用法: run-edge-auto.bat "达人广场URL"
    echo.
    echo 示例: run-edge-auto.bat "https://store.weixin.qq.com/shop/findersquare/find"
    pause
    exit /b 1
)

set TARGET_URL=%~1

echo ========================================
echo   自动获取WebSocket URL并连接
echo ========================================
echo.

echo 正在获取WebSocket URL...
curl -s http://localhost:9222/json/version > temp_response.json

REM 检查curl是否成功
if %errorlevel% neq 0 (
    echo 错误: 无法连接到Edge调试端口
    echo 请确保Edge以调试模式启动
    del temp_response.json 2>nul
    pause
    exit /b 1
)

REM 提取WebSocket URL (使用findstr)
for /f "tokens=2 delims=: " %%a in ('findstr "webSocketDebuggerUrl" temp_response.json') do (
    set WS_URL=%%a
    set WS_URL=!WS_URL:"=!
    goto :found
)

:found
del temp_response.json

if "!WS_URL!"=="" (
    echo 错误: 无法提取WebSocket URL
    pause
    exit /b 1
)

echo.
echo WebSocket URL: !WS_URL!
echo 目标URL: %TARGET_URL%
echo.
echo ========================================
echo   开始运行自动化脚本...
echo ========================================
echo.

node connect-direct.js "!WS_URL!" "%TARGET_URL%"

pause
