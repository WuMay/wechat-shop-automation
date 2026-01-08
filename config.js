// 配置文件
export const config = {
  // 浏览器配置
  browser: {
    headless: false, // 是否无头模式（false显示浏览器窗口）
    slowMo: 0,       // 慢动作延迟（毫秒）
    userDataDir: './user-data', // 用户数据目录（保存登录状态）
  },

  // 超时配置（毫秒）
  timeout: {
    pageLoad: 60000,        // 页面加载超时
    elementWait: 20000,     // 等待元素超时
    operation: 30000,       // 单个操作超时
    total: 3600000,        // 总运行超时（1小时）
  },

  // 模拟人类行为配置
  human: {
    minDelay: 500,          // 最小操作间隔
    maxDelay: 3000,         // 最大操作间隔
    randomScroll: true,     // 是否随机滚动
    mouseMove: true,        // 是否模拟鼠标移动轨迹
  },

  // 业务配置
  business: {
    // 达人广场页面选择器（需要根据实际情况修改）
    selectors: {
      // 达人列表项
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
    },

    // 达人数据存储文件
    dataFile: './invited-talents.json',

    // 最大重试次数
    maxRetries: 3,

    // 每页处理的最大达人数量
    maxPerPage: 50,
  },

  // 日志配置
  logging: {
    level: 'info', // error, warn, info, debug
    file: './automation.log',
  },
};

// 可以通过环境变量覆盖配置
if (process.env.HEADLESS === 'true') {
  config.browser.headless = true;
}

export default config;
