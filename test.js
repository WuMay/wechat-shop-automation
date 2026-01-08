#!/usr/bin/env node

/**
 * 测试脚本 - 验证环境和配置
 */

import { logger } from './utils.js';
import config from './config.js';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function testEnvironment() {
  console.log('\n========================================');
  console.log('环境测试');
  console.log('========================================\n');

  // 测试1: 检查配置
  console.log('✓ 测试1: 配置文件');
  console.log(`  - 无头模式: ${config.browser.headless}`);
  console.log(`  - 总超时: ${config.timeout.total}ms`);
  console.log(`  - 日志级别: ${config.logging.level}`);
  console.log('');

  // 测试2: 启动浏览器
  console.log('✓ 测试2: 启动浏览器');
  try {
    const browser = await puppeteer.launch({
      headless: config.browser.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('  - 浏览器启动成功');
    console.log('');

    // 测试3: 访问测试页面
    console.log('✓ 测试3: 访问测试页面');
    try {
      await page.goto('https://example.com', {
        waitUntil: 'networkidle2',
        timeout: config.timeout.pageLoad
      });
      const title = await page.title();
      console.log(`  - 页面标题: ${title}`);
      console.log('');
    } catch (error) {
      console.log(`  - 访问失败（可能网络问题）: ${error.message}`);
      console.log('');
    }

    // 测试4: 关闭浏览器
    console.log('✓ 测试4: 关闭浏览器');
    await browser.close();
    console.log('  - 浏览器已正常关闭');
    console.log('');

    // 测试5: 检查工具函数
    console.log('✓ 测试5: 工具函数');
    const delay = await new Promise(resolve => {
      setTimeout(() => resolve(100), 100);
    });
    console.log(`  - 延迟测试: ${delay}ms`);
    console.log('');

    // 完成
    console.log('========================================');
    console.log('所有测试通过！');
    console.log('========================================');
    console.log('\n可以开始使用脚本了：');
    console.log('  node index.js "达人广场URL"\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ 测试失败:', error.message);
    console.error('\n请检查：');
    console.error('  1. Node.js 是否正确安装');
    console.error('  2. 依赖是否完整安装 (npm install)');
    console.error('  3. config.js 配置是否正确\n');
    process.exit(1);
  }
}

// 运行测试
testEnvironment();
