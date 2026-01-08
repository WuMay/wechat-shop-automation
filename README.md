# 微信小店达人广场自动邀约脚本

## 🚀 快速开始（5分钟上手）

### Edge连接模式（推荐）- 使用你的Edge登录状态

```bash
# Windows（最简单）
双击: start-edge-debug.bat
在Edge中登录微信小店
运行: node edge-start.js "https://你的达人广场URL"

# macOS/Linux
./start-edge-debug.sh
在Edge中登录微信小店
运行: node edge-start.js "https://你的达人广场URL"
```

### 独立Chrome模式 - 完全自动化

```bash
npm install
node index.js "https://你的达人广场URL"
```

---

## ✨ 核心特性

✅ **Edge连接模式** - 使用你Edge的登录状态，实时看到操作
✅ **独立Chrome模式** - 完全自动化，支持无头运行
✅ **模拟真人操作** - 防检测，不易被封禁
✅ **断点续传** - 记录已邀约达人，支持中断后继续
✅ **自动翻页** - 处理所有页面达人

---

## 📚 快速导航

| 想要... | 查看文档 |
|---------|---------|
| 快速开始 | [EDGE-QUICKSTART.md](EDGE-QUICKSTART.md) ⭐ |
| 详细指南 | [EDGE-GUIDE.md](EDGE-GUIDE.md) |
| 如何运行 | [HOW-TO-RUN.md](HOW-TO-RUN.md) |
| 脚本说明 | [SCRIPTS-INDEX.md](SCRIPTS-INDEX.md) |
| 上传GitHub | [GITHUB-UPLOAD.md](GITHUB-UPLOAD.md) |
| 快速参考 | [QUICK-REFERENCE.md](QUICK-REFERENCE.md) |

---

## 功能特性

✅ **模拟真人操作**
- 随机操作延迟（500-3000ms）
- 鼠标轨迹模拟（贝塞尔曲线）
- 随机滚动和停留

✅ **防检测机制**
- 使用 `puppeteer-extra-plugin-stealth` 插件
- 随机 User-Agent
- 模拟真实用户行为模式

✅ **超时保护**
- 页面加载超时（60秒）
- 元素等待超时（20秒）
- 单操作超时（30秒）
- 总运行超时（1小时，可配置）

✅ **断点续传**
- 记录已邀约达人ID
- 自动跳过已邀约达人
- 支持中断后继续运行

✅ **自动化流程**
- 自动翻页处理
- 完整的邀约流程执行
- 异常自动恢复和重试

## 安装依赖

```bash
cd automation
npm install
```

或使用 pnpm：
```bash
cd automation
pnpm install
```

## 使用方法

### 1. 配置选择器

首次使用前，需要根据实际的微信小店页面结构修改 `config.js` 中的选择器：

```javascript
business: {
  selectors: {
    // 达人列表项 - 根据实际情况修改
    talentItem: '.talent-item, [class*="talent"], [class*="达人"]',

    // 详情按钮
    detailButton: '.detail-btn, [class*="detail"], [class*="详情"]',

    // 邀请带货按钮
    inviteButton: '.invite-btn, [class*="invite"], [class*="邀请"]',

    // 添加上次邀约商品
    addProductButton: '.add-product, [class*="add"], [class*="添加"]',

    // 确认按钮
    confirmButton: '.confirm-btn, [class*="confirm"], [class*="确认"]',

    // 发送邀约按钮
    sendInviteButton: '.send-invite, [class*="send"], [class*="发送"]',

    // 确认发送窗口
    confirmDialog: '.confirm-dialog, [class*="dialog"], [class*="窗口"]',

    // 下一页按钮
    nextPageButton: '.next-page, [class*="next"], [class*="下一页"]',
  }
}
```

### 2. 登录微信小店

首次运行脚本时：

```bash
node index.js "https://你的达人广场URL"
```

浏览器会打开，你需要：
1. 手动登录微信小店账号
2. 确保登录状态保持
3. 登录成功后，用户数据会保存到 `./user-data` 目录

后续运行可以直接使用保存的登录状态。

### 3. 运行脚本

```bash
# 显示浏览器窗口（推荐首次使用）
node index.js "https://你的达人广场URL"

# 无头模式（后台运行，不显示浏览器）
HEADLESS=true node index.js "https://你的达人广场URL"
```

### 4. 查看日志

实时日志输出到控制台，同时保存到 `automation.log` 文件：

```bash
# 实时查看日志
tail -f automation/automation.log
```

## 业务流程

脚本按照以下流程自动执行：

1. **达人广场页面** → 点击"详情"按钮
2. **跳转到达人详情页** → 检查是否有"邀请带货"按钮
   - 如果没有，关闭页面，返回步骤1
3. **点击"邀请带货"** → 跳转到邀约页
4. **点击"添加上次邀约商品"**
5. **点击"确认"按钮**
6. **点击"发送邀约"**
7. **在确认窗口点击"确认"**
8. **关闭当前页面** (Ctrl+W)
9. **跳转回到达人广场页面**
10. **循环处理下一个达人**
11. **当前页面处理完成后，自动翻页**
12. **直到所有页面处理完毕**

## 配置说明

### 浏览器配置

```javascript
browser: {
  headless: false,        // 是否无头模式
  slowMo: 0,             // 慢动作延迟（毫秒）
  userDataDir: './user-data',  // 用户数据目录
}
```

### 超时配置

```javascript
timeout: {
  pageLoad: 60000,        // 页面加载超时
  elementWait: 20000,     // 等待元素超时
  operation: 30000,       // 单个操作超时
  total: 3600000,        // 总运行超时（1小时）
}
```

### 模拟人类行为配置

```javascript
human: {
  minDelay: 500,          // 最小操作间隔
  maxDelay: 3000,         // 最大操作间隔
  randomScroll: true,     // 是否随机滚动
  mouseMove: true,        // 是否模拟鼠标移动轨迹
}
```

## 文件说明

```
automation/
├── index.js              # 主入口文件
├── inviter.js            # 邀约业务逻辑
├── config.js             # 配置文件
├── utils.js              # 工具函数
├── package.json          # 依赖配置
├── README.md             # 使用说明
├── user-data/            # 浏览器用户数据（自动生成）
├── invited-talents.json  # 已邀约达人记录（自动生成）
└── automation.log        # 运行日志（自动生成）
```

## 常见问题

### 1. 选择器不匹配

**问题**: 提示"未找到XXX按钮"

**解决**:
- 使用浏览器开发者工具（F12）检查页面元素
- 找到对应按钮的实际 class 或 id
- 更新 `config.js` 中的选择器

### 2. 登录状态失效

**问题**: 提示需要重新登录

**解决**:
- 删除 `./user-data` 目录
- 重新运行脚本，手动登录
- 确保使用稳定的网络环境

### 3. 页面加载超时

**问题**: 页面加载超过60秒

**解决**:
- 检查网络连接
- 增加 `config.timeout.pageLoad` 的值
- 检查目标URL是否正确

### 4. 被检测为机器人

**问题**: 频繁触发验证码或封禁

**解决**:
- 增加操作延迟（调整 `human.minDelay` 和 `human.maxDelay`）
- 减少每日运行次数
- 使用不同的IP地址（需要配置代理）

### 5. 重复邀约

**问题**: 已邀约的达人被重复处理

**解决**:
- 确保脚本正常关闭（不要强制终止）
- 检查 `invited-talents.json` 文件是否正常更新
- 手动清理重复的记录

## 注意事项

⚠️ **重要提示**:

1. **合法合规**: 请确保你的邀约行为符合微信小店的用户协议和服务条款
2. **适度使用**: 避免短时间内大量邀约，可能被认定为异常行为
3. **测试先行**: 先在测试环境运行，确认无误后再用于生产环境
4. **监控日志**: 定期查看日志，及时发现异常情况
5. **数据备份**: 定期备份 `invited-talents.json` 文件

## 技术栈

- **Node.js** - 运行环境
- **Puppeteer** - 浏览器自动化
- **Puppeteer Extra** - Puppeteer扩展
- **Stealth Plugin** - 防检测插件
- **Winston** - 日志管理

## 许可证

MIT License

## 免责声明

本脚本仅供学习和研究使用。使用者需自行承担使用本脚本产生的一切后果和法律责任。开发者不对因使用本脚本导致的任何损失或问题负责。
