# 🎯 从零开始 - 完整使用指南

## 第一步：下载或克隆项目

### 选项A：如果已下载
```bash
cd automation
```

### 选项B：从GitHub克隆
```bash
git clone https://github.com/你的用户名/wechat-shop-automation.git
cd wechat-shop-automation
```

---

## 第二步：选择使用模式

### 模式对比

| 特性 | Edge连接模式 ⭐推荐 | 独立Chrome模式 |
|------|-------------------|--------------|
| 使用现有登录状态 | ✅ 是 | ❌ 否 |
| 实时看到操作 | ✅ 是 | ✅ 需配置 |
| 首次登录 | ✅ 直接使用 | ✅ 需手动登录 |
| 反检测能力 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 启动方式 | 手动启动Edge | 脚本自动启动 |
| 适用场景 | 开发调试、小规模 | 服务器、大规模 |

**推荐：** 如果你是首次使用，选择 **Edge连接模式**

---

## 第三步：Edge连接模式完整流程

### 步骤3.1: 启动Edge调试模式

**Windows用户（最简单）：**
```cmd
双击运行: start-edge-debug.bat
```

**Windows用户（命令行）：**
```cmd
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --remote-debugging-port=9222 --user-data-dir="%USERPROFILE%\EdgeUserData"
```

**macOS用户：**
```bash
./start-edge-debug.sh
```

或手动运行：
```bash
/Applications/Microsoft\ Edge.app/Contents/MacOS/Microsoft\ Edge --remote-debugging-port=9222 --user-data-dir="$HOME/EdgeUserData"
```

**Linux用户：**
```bash
./start-edge-debug.sh
```

或手动运行：
```bash
microsoft-edge --remote-debugging-port=9222 --user-data-dir="$HOME/EdgeUserData"
```

**说明：**
- 这会启动一个调试模式的Edge浏览器
- 登录状态会保存在 `EdgeUserData` 目录
- 保持这个Edge浏览器打开

---

### 步骤3.2: 在Edge中登录微信小店

1. 在启动的Edge浏览器中，访问微信小店
2. 使用你的账号登录
3. 确保登录成功
4. **不要关闭Edge浏览器**

**注意：**
- 只需要登录一次
- 登录状态会自动保存到 `EdgeUserData` 目录
- 下次运行无需再登录

---

### 步骤3.3: 安装依赖

```bash
npm install
```

**说明：**
- 只需要安装一次
- 如果 `node_modules` 已存在，可跳过

---

### 步骤3.4: 测试连接（推荐）

```bash
node test-edge-connection.js
```

**期望输出：**
```
========================================
Edge浏览器连接测试
========================================

步骤1: 测试连接到Edge...
✓ 连接成功

步骤2: 获取浏览器信息...
  - 版本: Microsoft Edge 120.x.x
  - User-Agent: Mozilla/5.0...

步骤3: 检查打开的页面...
  - 当前打开的标签页数量: 1

========================================
所有测试通过！
```

**如果失败：**
1. 确认Edge是否以调试模式启动（命令包含 `--remote-debugging-port=9222`）
2. 检查9222端口是否被占用
3. 重新启动Edge调试模式

---

### 步骤3.5: 配置选择器（最重要！）

**打开 `config.js` 文件，找到 `business.selectors` 部分：**

```javascript
business: {
  selectors: {
    // 达人列表项
    talentItem: '.talent-item, [class*="talent"], [class*="达人"]',

    // 详情按钮 - 需要修改！
    detailButton: '.detail-btn, [class*="detail"], [class*="详情"]',

    // 邀请带货按钮 - 需要修改！
    inviteButton: '.invite-btn, [class*="invite"], [class*="邀请"]',

    // 添加上次邀约商品 - 需要修改！
    addProductButton: '.add-product, [class*="add"], [class*="添加"]',

    // 确认按钮 - 需要修改！
    confirmButton: '.confirm-btn, [class*="confirm"], [class*="确认"]',

    // 发送邀约按钮 - 需要修改！
    sendInviteButton: '.send-invite, [class*="send"], [class*="发送"]',

    // 确认发送窗口 - 需要修改！
    confirmDialog: '.confirm-dialog, [class*="dialog"], [class*="窗口"]',

    // 下一页按钮 - 需要修改！
    nextPageButton: '.next-page, [class*="next"], [class*="下一页"]',
  }
}
```

**如何找到正确的选择器？**

1. 在Edge中打开微信小店达人广场
2. 按F12打开开发者工具
3. 点击元素选择器图标（或按 Ctrl+Shift+C）
4. 点击页面上的"详情"按钮
5. 在Elements面板中查看按钮的class或id
6. 例如：class="talent-detail-btn" 或 id="detailBtn"
7. 更新config.js中对应的值

**示例：**

```javascript
// 如果你检查到的详情按钮class是 "talent-detail-btn"
detailButton: '.talent-detail-btn',

// 如果你检查到的邀请按钮id是 "inviteBtn"
inviteButton: '#inviteBtn',
```

**提示：**
- 可以使用class选择器（`.class-name`）或id选择器（`#id-name`）
- 优先使用id选择器（更精确）
- 如果class太长，可以使用部分匹配：`[class*="detail"]`

---

### 步骤3.6: 运行演示（可选，但推荐）

```bash
node demo-edge.js
```

**你会看到：**
- Edge自动打开新标签页
- 自动访问百度
- 自动输入搜索内容
- 自动点击搜索按钮

**目的：**
- 验证Edge连接正常
- 让你了解自动化操作的效果
- 增强信心

---

### 步骤3.7: 运行自动化脚本

```bash
node edge-start.js "https://你的达人广场URL"
```

**示例：**
```bash
node edge-start.js "https://weixin.qq.com/talent/square"
```

**你会看到：**

**1. 终端输出：**
```
========================================
连接到Edge浏览器...
========================================

✓ 已连接到Edge浏览器

✓ 已准备就绪

正在导航到: https://weixin.qq.com/talent/square

========================================
开始自动化操作...
========================================

========== 开始处理第 1 页 ==========
当前页面找到 20 个达人

开始处理达人: talent_1704739200000_0
✓ 成功点击: 详情按钮
✓ 成功点击: 邀请带货按钮
✓ 成功点击: 添加上次邀约商品
✓ 成功点击: 确认按钮
✓ 成功点击: 发送邀约
✓ 成功点击: 确认窗口
达人 talent_1704739200000_0: 邀约成功

...
```

**2. Edge浏览器中：**
- 自动导航到达人广场页面
- 自动点击"详情"按钮
- 自动点击"邀请带货"
- 自动完成整个邀约流程
- 自动翻页处理

**注意：**
- 你能看到所有实时操作
- 就像有人在你面前操作电脑一样
- 完全模拟真人行为

---

### 步骤3.8: 监控运行状态

**实时查看日志：**
```bash
# Windows
type automation.log

# macOS/Linux
tail -f automation.log
```

**查看已邀约记录：**
```bash
cat invited-talents.json
```

---

## 第四步：日常使用（第二天及以后）

### 简化流程

```
1. 双击 start-edge-debug.bat（启动Edge）
2. node edge-start.js "达人广场URL"
```

就这么简单！

### 不需要重复的操作

- ❌ 不需要重新配置选择器
- ❌ 不需要重新登录微信小店
- ❌ 不需要重新安装依赖
- ❌ 不需要重新测试连接

只需要每次运行前启动Edge调试模式即可。

---

## 第五步：常见问题处理

### 问题1: 连接失败

**错误信息：** `ECONNREFUSED 127.0.0.1:9222`

**原因：** Edge未以调试模式启动

**解决方法：**
```cmd
# Windows
双击: start-edge-debug.bat

# macOS/Linux
./start-edge-debug.sh
```

---

### 问题2: 找不到按钮

**错误信息：** `未找到XXX按钮`

**原因：** 选择器不正确

**解决方法：**
1. 使用F12检查页面元素
2. 更新 `config.js` 中的选择器

---

### 问题3: 页面加载超时

**错误信息：** `页面加载超时`

**原因：** 网络慢或超时设置过短

**解决方法：**
在 `config.js` 中增加超时时间：
```javascript
timeout: {
  pageLoad: 120000,  // 从60000增加到120000
}
```

---

### 问题4: 邀约失败

**错误信息：** `达人 xxx: 处理失败`

**原因：** 页面结构变化或流程错误

**解决方法：**
1. 查看 `automation.log` 获取详细错误
2. 使用显示模式运行，观察实际操作过程
3. 根据实际情况调整选择器

---

## 第六步：上传到GitHub（可选）

### 创建GitHub仓库

1. 访问 https://github.com/new
2. 创建新仓库（仓库名：`wechat-shop-automation`）
3. 不要初始化README

### 上传代码

```bash
# 初始化Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: 微信小店达人广场自动化邀约脚本"

# 添加远程仓库
git remote add origin https://YOUR_GITHUB_TOKEN@github.com/你的用户名/wechat-shop-automation.git

# 推送
git branch -M main
git push -u origin main
```

### 详细指南

查看 `GITHUB-UPLOAD.md` 了解更多细节。

---

## 📊 完整流程图

```
┌─────────────────────────────────────┐
│  第1天：首次使用                      │
├─────────────────────────────────────┤
│  1. 下载/克隆项目                    │
│     cd automation                   │
│     ↓                               │
│  2. 启动Edge调试模式                  │
│     双击 start-edge-debug.bat        │
│     ↓                               │
│  3. 在Edge中登录微信小店              │
│     （只需一次）                      │
│     ↓                               │
│  4. 安装依赖                         │
│     npm install                     │
│     ↓                               │
│  5. 测试连接                         │
│     node test-edge-connection.js    │
│     ↓                               │
│  6. 配置选择器（重要！）               │
│     编辑 config.js                   │
│     ↓                               │
│  7. 运行演示（可选）                  │
│     node demo-edge.js               │
│     ↓                               │
│  8. 运行自动化                       │
│     node edge-start.js "URL"        │
│     ↓                               │
│  9. 观察Edge自动操作                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  第2天及以后：日常使用                │
├─────────────────────────────────────┤
│  1. 启动Edge调试模式                  │
│     双击 start-edge-debug.bat        │
│     ↓                               │
│  2. 运行自动化                       │
│     node edge-start.js "URL"        │
│     ↓                               │
│  3. 观察操作即可                      │
└─────────────────────────────────────┘
```

---

## 🎯 关键要点总结

### 必须做的（一次）
- ✅ 启动Edge调试模式
- ✅ 在Edge中登录微信小店
- ✅ 安装依赖 `npm install`
- ✅ 配置选择器 `config.js`

### 每次都要做的
- ✅ 启动Edge调试模式
- ✅ 运行自动化脚本

### 不需要做的
- ❌ 重复配置选择器
- ❌ 重复登录微信小店
- ❌ 重复安装依赖
- ❌ 手动打开达人广场页面

---

## 📚 获取帮助

| 问题 | 查看文档 |
|------|---------|
| 快速开始 | [EDGE-QUICKSTART.md](EDGE-QUICKSTART.md) |
| 详细指南 | [EDGE-GUIDE.md](EDGE-GUIDE.md) |
| 如何运行 | [HOW-TO-RUN.md](HOW-TO-RUN.md) |
| 脚本说明 | [SCRIPTS-INDEX.md](SCRIPTS-INDEX.md) |
| 快速参考 | [QUICK-REFERENCE.md](QUICK-REFERENCE.md) |
| 上传GitHub | [GITHUB-UPLOAD.md](GITHUB-UPLOAD.md) |
| 本指南 | [GET-STARTED.md](GET-STARTED.md) |

---

## 🎉 现在开始！

```bash
# Windows
双击: start-edge-debug.bat
在Edge中登录微信小店
运行: node edge-start.js "达人广场URL"

# macOS/Linux
./start-edge-debug.sh
在Edge中登录微信小店
运行: node edge-start.js "达人广场URL"
```

**就这么简单！** 🚀

有任何问题，参考上面的文档或查看日志文件 `automation.log`。
