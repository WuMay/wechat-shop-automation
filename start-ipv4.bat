@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 检查参数
if "%~1"=="" (
    echo 用法: start-ipv4.bat "达人广场URL"
    echo.
    echo 示例: start-ipv4.bat "https://store.weixin.qq.com/shop/findersquare/find"
    pause
    exit /b 1
)

set TARGET_URL=%~1

echo ========================================
echo   通过IPv4连接并运行自动化脚本
echo ========================================
echo.
echo 说明: 使用127.0.0.1代替localhost，避免IPv6连接问题
echo.

node connect-ipv4.js "%TARGET_URL%"

pause
