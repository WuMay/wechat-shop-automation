# 🚀 如何运行自动化脚本

## 快速回答你的问题

### ❓ 需要我手动打开浏览器吗？
**答：不需要！**

**Edge连接模式：**
- 脚本会自动启动调试模式的Edge浏览器
- 或者连接到你已经打开的Edge（如果以调试模式启动）
- 你只需要运行命令即可

**独立Chrome模式：**
- 脚本会自动启动一个新的Chrome浏览器
- 完全自动化，无需手动干预

### ❓ 需要手动打开达人广场页面吗？
**答：不需要！**

- 脚本会自动导航到达人广场页面
- 你只需要提供URL，脚本会自动处理

---

## 📋 完整运行步骤（最详细版本）

### 推荐方式：Edge连接模式（使用你的Edge登录状态）

#### 步骤1: 启动Edge调试模式

**Windows（最简单）：**
```cmd
双击运行: start-edge-debug.bat
```

**Windows（命令行）：**
```cmd
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --remote-debugging-port=9222 --user-data-dir="%USERPROFILE%\EdgeUserData"
```

**macOS/Linux：**
```bash
./start-edge-debug.sh
```

或者：
```bash
/Applications/Microsoft\ Edge.app/Contents/MacOS/Microsoft\ Edge --remote-debugging-port=9222 --user-data-dir="$HOME/EdgeUserData"
```

**说明：**
- 这会启动一个调试模式的Edge浏览器
- 你的登录状态会保存在 `EdgeUserData` 目录
- 保持这个Edge浏览器打开

---

#### 步骤2: 在Edge中登录微信小店

1. 在启动的Edge浏览器中，访问微信小店
2. 使用你的账号登录
3. 确保登录成功
4. **不要关闭Edge浏览器**

**注意：**
- 只需要登录一次
- 登录状态会自动保存
- 下次运行无需再登录

---

#### 步骤3: 配置选择器（必须！）

**这是最重要的一步！**

1. 打开 `config.js` 文件
2. 找到 `business.selectors` 部分
3. 根据实际页面修改选择器

**如何找到正确的选择器？**

```
1. 在Edge中打开微信小店达人广场
2. 按F12打开开发者工具
3. 点击元素选择器图标（或按 Ctrl+Shift+C）
4. 点击页面上的"详情"按钮
5. 在Elements面板中查看按钮的class或id
6. 例如：class="btn-detail" 或 id="detailBtn"
7. 更新config.js中对应的值
```

**示例：**

```javascript
business: {
  selectors: {
    // 假设你检查到的详情按钮class是 "talent-detail-btn"
    detailButton: '.talent-detail-btn',

    // 假设邀请按钮的class是 "invite-talent-btn"
    inviteButton: '.invite-talent-btn',

    // 其他按钮同理...
    addProductButton: '.add-product',
    confirmButton: '.confirm-btn',
    sendInviteButton: '.send-invite',
    confirmDialog: '.confirm-modal',
    nextPageButton: '.next-page',
  }
}
```

---

#### 步骤4: 测试连接（可选但推荐）

```bash
cd automation
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

如果测试失败，检查：
1. Edge是否以调试模式启动？
2. 9222端口是否可用？

---

#### 步骤5: 运行自动化脚本

```bash
node edge-start.js "https://你的达人广场URL"
```

**示例：**
```bash
node edge-start.js "https://weixin.qq.com/talent/square"
```

**你会看到：**

1. 终端输出日志：
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
...
```

2. Edge浏览器中的操作：
   - 自动到达人广场页面
   - 自动点击"详情"按钮
   - 自动点击"邀请带货"
   - 自动完成整个邀约流程
   - 自动翻页

---

## 备选方式：独立Chrome模式

如果不想使用Edge模式，可以使用独立Chrome模式：

```bash
# 安装依赖
cd automation
npm install

# 运行脚本
node index.js "https://你的达人广场URL"
```

**特点：**
- 脚本会自动启动一个新的Chrome浏览器
- 首次需要手动登录微信小店
- 登录状态保存在 `user-data` 目录
- 下次运行无需再登录

---

## ⚙️ 配置说明

### 1. 超时配置（config.js）

如果页面加载慢，可以增加超时时间：

```javascript
timeout: {
  pageLoad: 120000,        // 页面加载超时（毫秒）默认60000
  elementWait: 30000,      // 等待元素超时（毫秒）默认20000
  operation: 60000,        // 单个操作超时（毫秒）默认30000
  total: 7200000,         // 总运行超时（毫秒）默认3600000（2小时）
}
```

### 2. 操作间隔配置（config.js）

如果操作太快，增加延迟：

```javascript
human: {
  minDelay: 1000,          // 最小操作间隔（毫秒）默认500
  maxDelay: 5000,          // 最大操作间隔（毫秒）默认3000
}
```

### 3. 数据文件配置（config.js）

修改已邀约达人记录的保存位置：

```javascript
business: {
  dataFile: './invited-talents.json',
}
```

---

## 📊 监控运行状态

### 实时查看日志

```bash
# Windows
type automation.log

# macOS/Linux
tail -f automation.log
```

### 查看已邀约记录

```bash
cat invited-talents.json
```

### 查看当前连接的Edge页面

```bash
curl http://localhost:9222/json
```

---

## ⚠️ 常见问题

### 问题1: 连接失败

**错误信息：** `ECONNREFUSED 127.0.0.1:9222`

**解决方法：**
1. 确认Edge以调试模式启动（命令包含 `--remote-debugging-port=9222`）
2. 检查端口是否被占用：
   ```bash
   # Windows
   netstat -ano | findstr :9222

   # macOS/Linux
   lsof -i :9222
   ```
3. 如果被占用，关闭占用端口的程序

---

### 问题2: 找不到按钮

**错误信息：** `未找到XXX按钮`

**解决方法：**
1. 使用F12检查页面元素
2. 更新 `config.js` 中的选择器
3. 确保页面加载完成

---

### 问题3: 页面加载超时

**错误信息：** `页面加载超时`

**解决方法：**
1. 检查网络连接
2. 增加 `config.timeout.pageLoad` 的值
3. 检查URL是否正确

---

### 问题4: 登录状态失效

**错误信息：** 需要重新登录

**解决方法：**
1. 在Edge中重新登录微信小店
2. 确保使用 `--user-data-dir` 参数
3. 不要清除Edge的Cookie

---

### 问题5: 邀约失败

**错误信息：** `达人 xxx: 处理失败`

**解决方法：**
1. 查看 `automation.log` 获取详细错误
2. 使用显示模式运行，观察实际操作过程
3. 根据实际情况调整代码或选择器

---

## 🎯 运行流程图

```
┌─────────────────────────────────────┐
│  准备阶段                              │
├─────────────────────────────────────┤
│  1. 启动Edge调试模式                  │
│     双击 start-edge-debug.bat        │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  2. 在Edge中登录微信小店              │
│     （只需一次）                      │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  3. 配置选择器（重要！）               │
│     修改 config.js                    │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  4. 测试连接（可选）                  │
│     node test-edge-connection.js    │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  5. 运行自动化                        │
│     node edge-start.js "URL"         │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  6. 观察Edge自动操作                 │
│     实时看到所有操作                  │
└─────────────────────────────────────┘
```

---

## 💡 最佳实践

1. **首次运行前**
   - ✅ 先配置选择器
   - ✅ 测试连接
   - ✅ 小规模测试

2. **运行过程中**
   - ✅ 保持Edge打开
   - ✅ 监控日志输出
   - ✅ 检查邀约记录

3. **运行完成后**
   - ✅ 检查统计数据
   - ✅ 备份邀约记录
   - ✅ 不要手动关闭Edge（脚本会自动断开连接）

---

## 🎉 总结

**你只需要做三件事：**

1. **启动Edge调试模式**
   ```bash
   双击: start-edge-debug.bat
   ```

2. **在Edge中登录微信小店**
   （只需一次）

3. **运行自动化脚本**
   ```bash
   node edge-start.js "https://你的达人广场URL"
   ```

**其他都是自动的！**

- ✅ 自动导航到达人广场
- ✅ 自动点击各个按钮
- ✅ 自动完成邀约流程
- ✅ 自动翻页处理
- ✅ 自动保存邀约记录
- ✅ 你能看到所有实时操作！

**就是这么简单！** 🚀
