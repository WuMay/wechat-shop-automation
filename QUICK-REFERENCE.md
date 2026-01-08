# 📋 快速参考卡片

## 🎯 一句话总结

**启动Edge调试模式 → 在Edge中登录微信小店 → 运行脚本即可自动化！**

---

## ⚡ 快速开始（3步）

### Windows
```cmd
# 步骤1: 双击启动Edge
双击: start-edge-debug.bat

# 步骤2: 在Edge中登录微信小店

# 步骤3: 运行脚本
cd automation
node edge-start.js "https://你的达人广场URL"
```

### macOS/Linux
```bash
# 步骤1: 启动Edge
./start-edge-debug.sh

# 步骤2: 在Edge中登录微信小店

# 步骤3: 运行脚本
cd automation
node edge-start.js "https://你的达人广场URL"
```

---

## ❓ 常见问题快速解答

### Q: 需要手动打开浏览器吗？
**A: 不需要！** 脚本会自动启动或连接Edge。

### Q: 需要手动打开达人广场页面吗？
**A: 不需要！** 脚本会自动导航到达人广场。

### Q: 只需要登录一次吗？
**A: 是的！** 登录状态会自动保存。

### Q: 能看到操作过程吗？
**A: 能！** 在Edge中实时看到所有操作。

### Q: 需要配置什么吗？
**A: 需要修改 `config.js` 中的选择器（最重要！）。

---

## 🔑 关键配置（必须修改！）

打开 `config.js`，找到 `business.selectors`，修改选择器：

```javascript
business: {
  selectors: {
    detailButton: '.detail-btn',      // 改成实际的
    inviteButton: '.invite-btn',      // 改成实际的
    addProductButton: '.add-product',  // 改成实际的
    // ... 其他按钮同理
  }
}
```

**如何找到正确的选择器？**
1. 在Edge中打开达人广场
2. 按F12打开开发者工具
3. 点击元素选择器（Ctrl+Shift+C）
4. 点击页面上的按钮
5. 查看class或id，更新config.js

---

## 📁 文件索引

| 想要... | 使用文件 | 命令 |
|---------|---------|------|
| 快速开始 | `EDGE-QUICKSTART.md` | 查看 |
| 详细指南 | `EDGE-GUIDE.md` | 查看 |
| 运行说明 | `HOW-TO-RUN.md` | 查看 |
| 配置选择器 | `config.js` | 编辑 |
| 测试连接 | `test-edge-connection.js` | `node test-edge-connection.js` |
| 运行自动化 | `edge-start.js` | `node edge-start.js "URL"` |
| 上传GitHub | `GITHUB-UPLOAD.md` | 查看 |

---

## 🛠️ 常用命令

### 安装依赖
```bash
npm install
```

### 测试连接
```bash
node test-edge-connection.js
```

### 运行自动化
```bash
node edge-start.js "https://你的达人广场URL"
```

### 查看日志
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

---

## ⚠️ 重要提示

1. **必须配置选择器** - 首次运行前必须修改 `config.js`
2. **保持Edge打开** - 脚本运行时不要关闭Edge
3. **首次登录** - 首次需要在Edge中手动登录微信小店
4. **测试连接** - 建议先运行 `test-edge-connection.js` 测试
5. **小规模测试** - 建议先小规模测试，确认无误再大规模使用

---

## 📊 两种模式对比

| 特性 | Edge连接模式 ⭐推荐 | 独立Chrome模式 |
|------|-------------------|--------------|
| 使用现有登录状态 | ✅ 是 | ❌ 否 |
| 实时看到操作 | ✅ 是 | ✅ 需配置 |
| 启动方式 | 手动启动Edge | 脚本自动启动 |
| 反检测能力 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 使用命令 | `node edge-start.js "URL"` | `node index.js "URL"` |

---

## 🚨 故障排除速查

| 错误 | 原因 | 解决方法 |
|------|------|---------|
| `ECONNREFUSED 127.0.0.1:9222` | Edge未以调试模式启动 | 使用 `start-edge-debug.bat` 启动Edge |
| `未找到XXX按钮` | 选择器不正确 | 修改 `config.js` 中的选择器 |
| `页面加载超时` | 网络慢或超时设置过短 | 增加 `config.timeout.pageLoad` |
| `需要重新登录` | Cookie过期 | 在Edge中重新登录 |
| `邀约失败` | 页面结构变化或流程错误 | 检查日志，调整选择器 |

---

## 🎯 完整流程

```
1. 启动Edge调试模式
   Windows: 双击 start-edge-debug.bat
   ↓
2. 在Edge中登录微信小店（只需一次）
   ↓
3. 修改 config.js 选择器（必须！）
   ↓
4. 测试连接（可选）
   node test-edge-connection.js
   ↓
5. 运行自动化
   node edge-start.js "达人广场URL"
   ↓
6. 观察Edge自动操作 ✨
```

---

## 📞 获取帮助

1. **快速开始** - 查看 `EDGE-QUICKSTART.md`
2. **详细指南** - 查看 `EDGE-GUIDE.md`
3. **运行说明** - 查看 `HOW-TO-RUN.md`
4. **GitHub上传** - 查看 `GITHUB-UPLOAD.md`
5. **文件说明** - 查看 `PROJECT-FILES.md`

---

## ✨ 核心优势

✅ 使用你的Edge登录状态
✅ 实时看到所有操作
✅ 模拟真人操作（防检测）
✅ 自动保存邀约记录
✅ 断点续传功能
✅ 自动翻页处理

---

## 🎉 现在开始！

```bash
# Windows
双击: start-edge-debug.bat
然后: node edge-start.js "达人广场URL"

# macOS/Linux
./start-edge-debug.sh
然后: node edge-start.js "达人广场URL"
```

**就这么简单！** 🚀
