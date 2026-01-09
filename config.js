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
    // 达人广场页面选择器（根据实际页面结构更新）
    selectors: {
      // 达人列表项（表格的每一行）
      talentItem: '.weui-desktop-table__core-table tbody tr',
      // 详情按钮（右侧文本）
      detailButton: '.w-full.text-right',
      // 邀请带货按钮（主按钮，包含文本"邀请带货"）
      inviteButton: 'button.weui-desktop-btn.weui-desktop-btn_primary',
      // 添加上次邀约商品链接
      addProductButton: 'a[href="javascript:void(0)"]',
      // 确认按钮（多个地方使用）
      confirmButton: 'button.weui-desktop-btn.weui-desktop-btn_primary',
      // 发送邀约按钮
      sendInviteButton: 'button.weui-desktop-btn.weui-desktop-btn_primary',
      // 确认发送窗口
      confirmDialog: 'button.weui-desktop-btn.weui-desktop-btn_primary',
      // 下一页按钮
      nextPageButton: 'a.weui-desktop-btn.weui-desktop-btn_default.weui-desktop-btn_mini',
    },

    // 按钮文本匹配（用于区分相同class的按钮）
    buttonTexts: {
      inviteButton: '邀请带货',
      addButton: '添加上次邀约商品',
      confirmButton: '确认',
      sendInviteButton: '发送邀约',
      nextPageButton: '下一页',
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
