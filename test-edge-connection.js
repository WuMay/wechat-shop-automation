#!/usr/bin/env node

/**
 * 测试Edge浏览器连接
 */

import { EdgeConnector } from './edge-connector.js';
import { logger } from './utils.js';

async function testEdgeConnection() {
  console.log('\n========================================');
  console.log('Edge浏览器连接测试');
  console.log('========================================\n');

  const connector = new EdgeConnector({
    debugUrl: 'http://localhost:9222'
  });

  try {
    // 步骤1: 连接测试
    console.log('步骤1: 测试连接到Edge...');
    await connector.connect();
    console.log('✓ 连接成功\n');

    // 步骤2: 获取浏览器信息
    console.log('步骤2: 获取浏览器信息...');
    const browser = connector.browser;
    const version = await browser.version();
    const userAgent = await (await browser.userAgent());

    console.log(`  - 版本: ${version}`);
    console.log(`  - User-Agent: ${userAgent.substring(0, 80)}...\n`);

    // 步骤3: 获取当前打开的页面
    console.log('步骤3: 检查打开的页面...');
    const pages = await browser.pages();
    console.log(`  - 当前打开的标签页数量: ${pages.length}`);

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const url = await page.url();
      const title = await page.title();
      console.log(`  - 标签页 ${i + 1}: ${title} (${url})`);
    }
    console.log('');

    // 步骤4: 测试创建新页面
    console.log('步骤4: 测试创建新页面...');
    const newPage = await connector.newPage();
    console.log('✓ 新页面创建成功\n');

    // 步骤5: 测试导航
    console.log('步骤5: 测试页面导航...');
    await newPage.goto('https://www.baidu.com', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    const title = await newPage.title();
    console.log(`✓ 页面加载完成: ${title}\n`);

    // 步骤6: 等待3秒
    console.log('步骤6: 等待3秒，你可以看到Edge中的变化...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✓ 测试完成\n');

    // 步骤7: 清理
    console.log('步骤7: 清理测试页面...');
    await newPage.close();
    console.log('✓ 测试页面已关闭\n');

    // 断开连接（不关闭Edge）
    console.log('步骤8: 断开连接...');
    await connector.disconnect();
    console.log('✓ 已断开连接（Edge保持打开）\n');

    console.log('========================================');
    console.log('所有测试通过！');
    console.log('========================================\n');

    console.log('现在可以运行自动化脚本：');
    console.log('  node edge-start.js "达人广场URL"\n');

    process.exit(0);

  } catch (error) {
    console.error('\n✗ 测试失败:', error.message);
    console.error('\n请检查：');
    console.error('1. Edge是否以调试模式启动？');
    console.error('   Windows: msedge.exe --remote-debugging-port=9222');
    console.error('   macOS: /Applications/Microsoft\\ Edge.app/Contents/MacOS/Microsoft\\ Edge --remote-debugging-port=9222');
    console.error('');
    console.error('2. 9222端口是否可用？');
    console.error('   Windows: netstat -ano | findstr :9222');
    console.error('   macOS/Linux: lsof -i :9222');
    console.error('');
    console.error('3. Edge是否正在运行？\n');

    process.exit(1);
  }
}

// 运行测试
testEdgeConnection();
