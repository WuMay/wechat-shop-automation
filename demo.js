#!/usr/bin/env node

/**
 * 简单演示脚本 - 展示Puppeteer如何控制浏览器
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { randomDelay } from './utils.js';

puppeteer.use(StealthPlugin());

async function demo() {
  console.log('\n========================================');
  console.log('Puppeteer自动化演示');
  console.log('========================================\n');
  
  console.log('步骤1: 启动浏览器...');
  const browser = await puppeteer.launch({
    headless: false,  // 显示浏览器窗口
    args: ['--no-sandbox']
  });
  
  console.log('✓ 浏览器已启动（你会看到一个新的Chrome窗口）\n');
  
  console.log('步骤2: 创建页面...');
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('✓ 页面已创建\n');
  
  console.log('步骤3: 访问百度首页...');
  await page.goto('https://www.baidu.com', { waitUntil: 'networkidle2' });
  console.log('✓ 页面加载完成\n');
  
  await randomDelay(2000);
  
  console.log('步骤4: 模拟真人搜索...');
  
  // 找到搜索框
  const searchBox = await page.$('#kw');
  if (searchBox) {
    console.log('  - 输入搜索内容...');
    await searchBox.type('Puppeteer自动化演示', { delay: 100 }); // 模拟打字
    await randomDelay(1000);
    
    // 点击搜索按钮
    console.log('  - 点击"百度一下"按钮...');
    const searchButton = await page.$('#su');
    if (searchButton) {
      await searchButton.click();
      await randomDelay(2000);
      console.log('  ✓ 搜索完成\n');
    }
  }
  
  console.log('步骤5: 获取页面标题...');
  const title = await page.title();
  console.log(`✓ 当前页面标题: ${title}\n`);
  
  console.log('步骤6: 等待5秒后关闭浏览器...');
  await randomDelay(5000);
  
  await browser.close();
  console.log('✓ 浏览器已关闭\n');
  
  console.log('========================================');
  console.log('演示完成！');
  console.log('========================================\n');
  
  console.log('说明：');
  console.log('1. 脚本启动了一个全新的Chrome浏览器');
  console.log('2. 通过Puppeteer API控制浏览器操作');
  console.log('3. 你能看到的窗口是自动化浏览器，不是手动打开的');
  console.log('4. 所有操作（导航、输入、点击）都由脚本自动完成\n');
}

demo().catch(error => {
  console.error('演示失败:', error.message);
  process.exit(1);
});
