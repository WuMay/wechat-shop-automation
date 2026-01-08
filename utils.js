import winston from 'winston';

// 配置日志
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'automation.log' })
  ]
});

// 随机延迟函数（毫秒）
export function randomDelay(min = 1000, max = 3000) {
  return new Promise(resolve => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, delay);
  });
}

// 模拟人类鼠标移动轨迹（贝塞尔曲线）
export async function humanLikeMouseMove(page, element) {
  const box = await element.boundingBox();
  if (!box) return;

  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  const steps = Math.floor(Math.random() * 20) + 10; // 10-30步
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    // 添加一些随机抖动
    const jitterX = (Math.random() - 0.5) * 10;
    const jitterY = (Math.random() - 0.5) * 10;

    await page.mouse.move(
      startX * progress + jitterX,
      startY * progress + jitterY,
      { steps: 1 }
    );

    await randomDelay(10, 30); // 每步之间的微小延迟
  }
}

// 模拟人类点击
export async function humanLikeClick(page, selector) {
  try {
    await randomDelay(500, 1500); // 点击前随机等待

    const element = await page.$(selector);
    if (!element) {
      throw new Error(`元素未找到: ${selector}`);
    }

    // 模拟鼠标移动
    await humanLikeMouseMove(page, element);

    // 点击
    await element.click();

    await randomDelay(300, 800); // 点击后随机等待

    logger.info(`成功点击: ${selector}`);
    return true;
  } catch (error) {
    logger.error(`点击失败 ${selector}: ${error.message}`);
    return false;
  }
}

// 等待元素出现（带超时）
export async function waitForElement(page, selector, timeout = 30000) {
  try {
    await page.waitForSelector(selector, { timeout, visible: true });
    return true;
  } catch (error) {
    logger.error(`等待元素超时: ${selector}`);
    return false;
  }
}

// 检查元素是否存在
export async function elementExists(page, selector) {
  try {
    const element = await page.$(selector);
    return element !== null;
  } catch {
    return false;
  }
}

// 获取元素文本
export async function getElementText(page, selector) {
  try {
    const element = await page.$(selector);
    if (!element) return null;
    const text = await element.evaluate(el => el.textContent?.trim());
    return text;
  } catch (error) {
    logger.error(`获取元素文本失败: ${selector}`);
    return null;
  }
}

// 获取页面URL
export async function getPageUrl(page) {
  return page.url();
}

// 超时包装器
export function withTimeout(promise, timeoutMs, errorMessage = '操作超时') {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    )
  ]);
}

// 重试机制
export async function retry(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      logger.warn(`操作失败，重试 ${i + 1}/${maxRetries}: ${error.message}`);
      await randomDelay(delay, delay * 2);
    }
  }
}

// 生成随机用户代理
export function getRandomUserAgent() {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}
