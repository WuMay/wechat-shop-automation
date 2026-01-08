#!/usr/bin/env node

import { TalentInviter } from './inviter.js';
import { logger } from './utils.js';
import config from './config.js';

// 显示使用说明
function showUsage() {
  console.log(`
微信小店达人广场自动邀约脚本
================================

使用方法:
  node index.js <达人广场URL>

示例:
  node index.js "https://example.com/talent-square"

环境变量:
  HEADLESS=true    启用无头模式（默认显示浏览器窗口）

配置文件:
  config.js        主要配置文件，可修改选择器、超时时间等

输出文件:
  automation.log  运行日志
  invited-talents.json  已邀约达人记录

注意事项:
  1. 首次运行会创建用户数据目录，保存登录状态
  2. 请确保已手动登录微信小店
  3. 选择器可能需要根据实际页面结构调整
  4. 建议先在测试环境运行，确认无误后再使用

技术特点:
  ✓ 模拟真人操作（随机延迟、鼠标轨迹）
  ✓ 防检测（使用stealth插件）
  ✓ 超时保护（页面加载、操作、总时长）
  ✓ 断点续传（记录已邀约达人）
  ✓ 自动翻页处理
  ✓ 详细日志记录
  `);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);

  // 显示帮助
  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    showUsage();
    process.exit(0);
  }

  const startUrl = args[0];

  logger.info('========================================');
  logger.info('微信小店达人广场自动邀约脚本启动');
  logger.info('========================================');
  logger.info(`目标URL: ${startUrl}`);
  logger.info(`无头模式: ${config.browser.headless}`);
  logger.info(`最大总超时: ${config.timeout.total}ms`);
  logger.info('========================================\n');

  try {
    const inviter = new TalentInviter(config);
    await inviter.run(startUrl);
    logger.info('\n脚本执行完成！');
    process.exit(0);
  } catch (error) {
    logger.error(`\n脚本执行失败: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
  }
}

// 运行主函数
main();
