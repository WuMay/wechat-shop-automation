#!/usr/bin/env node

/**
 * Edge连接模式演示
 * 展示如何连接到Edge浏览器并执行基本操作
 */

import { EdgeConnector } from './edge-connector.js';
import { randomDelay } from './utils.js';

async function demoEdgeConnection() {
  console.log('\n========================================');
  console.log('Edge连接模式演示');
  console.log('========================================\n');

  console.log('请确保：');
  console.log('  1. Edge以调试模式启动');
  console.log('  2. 在Edge中已登录微信小店');
  console.log('  3. 保持Edge浏览器打开\n');

  await randomDelay(3000);

  const connector = new EdgeConnector({
    debugUrl: 'http://localhost:9222'
  });

  try {
    console.log('步骤1: 连接到Edge浏览器...');
    await connector.connect();
    console.log('✓ 已连接到Edge\n');

    console.log('步骤2: 获取当前页面...');
    const pages = await connector.pages();
    console.log(`✓ 当前有 ${pages.length} 个标签页\n`);

    console.log('步骤3: 创建新标签页...');
    const page = await connector.newPage();
    console.log('✓ 新标签页已创建\n');

    console.log('步骤4: 访问百度首页（观察Edge浏览器）...');
    await page.goto('https://www.baidu.com', { waitUntil: 'networkidle2' });

    console.log('步骤5: 模拟真人搜索...');
    console.log('  - 输入搜索内容...');

    // 找到搜索框
    const searchBox = await page.$('#kw');
    if (searchBox) {
      // 模拟真人打字（每个字母之间有延迟）
      await searchBox.type('Edge连接模式自动化演示', { delay: 150 });

      await randomDelay(1000);

      console.log('  - 点击搜索按钮...');

      // 点击搜索按钮
      const searchButton = await page.$('#su');
      if (searchButton) {
        await searchButton.click();
        await randomDelay(2000);

        const title = await page.title();
        console.log(`  ✓ 搜索完成，页面标题: ${title}\n`);
      }
    } else {
      console.log('  ✗ 未找到搜索框\n');
    }

    console.log('步骤6: 等待5秒，请观察Edge浏览器...');
    console.log('  你应该能看到：');
    console.log('  - 新标签页自动打开');
    console.log('  - 自动访问百度');
    console.log('  - 自动输入并搜索\n');

    await randomDelay(5000);

    console.log('步骤7: 关闭演示标签页...');
    await page.close();
    console.log('✓ 演示标签页已关闭\n');

    console.log('步骤8: 断开连接...');
    await connector.disconnect();
    console.log('✓ 已断开连接（Edge保持打开）\n');

    console.log('========================================');
    console.log('演示完成！');
    console.log('========================================\n');

    console.log('说明：');
    console.log('  ✓ 脚本成功连接到你的Edge浏览器');
    console.log('  ✓ 你能看到所有实时操作');
    console.log('  ✓ Edge的登录状态被使用');
    console.log('  ✓ 脚本断开后Edge保持打开\n');

    console.log('现在可以运行自动化脚本：');
    console.log('  node edge-start.js "达人广场URL"\n');

    process.exit(0);

  } catch (error) {
    console.error('\n✗ 演示失败:', error.message);
    console.error('\n请确保：');
    console.error('  1. Edge以调试模式启动：');
    console.error('     msedge.exe --remote-debugging-port=9222');
    console.error('  2. 9222端口可用');
    console.error('  3. Edge浏览器正在运行\n');

    process.exit(1);
  }
}

// 运行演示
demoEdgeConnection();
