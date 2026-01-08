@echo off
chcp 65001 >nul
echo ========================================
echo   启动Edge调试模式 (Windows)
echo ========================================
echo.

REM 设置用户数据目录
set EDGE_DATA_DIR=C:\EdgeUserData

REM 创建目录
if not exist "%EDGE_DATA_DIR%" (
    echo 创建用户数据目录: %EDGE_DATA_DIR%
    mkdir "%EDGE_DATA_DIR%"
)

echo 正在启动Edge调试模式...
echo.
echo 注意:
echo   - 调试端口: 9222
echo   - 用户数据目录: %EDGE_DATA_DIR%
echo   - 请保持Edge浏览器打开
echo.

REM 检查Edge是否安装
where msedge >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到msedge.exe
    echo 请确认Edge浏览器已安装
    pause
    exit /b 1
)

REM 启动Edge调试模式
start msedge --remote-debugging-port=9222 --user-data-dir="%EDGE_DATA_DIR%"

echo.
echo Edge浏览器已启动
echo.
echo 下一步:
echo   1. 在Edge中登录微信小店
echo   2. 运行自动化脚本: node edge-start.js "达人广场URL"
echo.
pause
