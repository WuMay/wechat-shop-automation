/**
 * Edge浏览器连接器
 * 连接到以调试模式运行的Edge浏览器
 */

import puppeteer from 'puppeteer';
import { logger } from './utils.js';

export class EdgeConnector {
  constructor(options = {}) {
    this.browser = null;
    this.debugUrl = options.debugUrl || 'http://localhost:9222';
    this.options = options;
  }

  /**
   * 连接到Edge浏览器
   */
  async connect() {
    try {
      logger.info(`尝试连接到: ${this.debugUrl}`);

      // 使用puppeteer连接到现有的浏览器实例
      this.browser = await puppeteer.connect({
        browserURL: this.debugUrl,
        defaultViewport: null // 使用浏览器的默认视口
      });

      // 验证连接
      const version = await this.browser.version();
      logger.info(`浏览器版本: ${version}`);

      // 获取所有页面
      const pages = await this.browser.pages();
      logger.info(`当前打开的标签页数量: ${pages.length}`);

      return this.browser;

    } catch (error) {
      throw new Error(`连接Edge失败: ${error.message}\n请确保Edge以调试模式启动: msedge --remote-debugging-port=9222`);
    }
  }

  /**
   * 获取现有页面或创建新页面
   */
  async getOrCreatePage() {
    if (!this.browser) {
      throw new Error('浏览器未连接');
    }

    const pages = await this.browser.pages();

    // 如果有现有页面，使用第一个，否则创建新页面
    if (pages.length > 0) {
      logger.info('使用现有页面');
      return pages[0];
    } else {
      logger.info('创建新页面');
      const page = await this.browser.newPage();
      
      // 设置视口（可选）
      await page.setViewport({
        width: 1920,
        height: 1080
      });

      return page;
    }
  }

  /**
   * 创建新页面
   */
  async newPage() {
    if (!this.browser) {
      throw new Error('浏览器未连接');
    }

    const page = await this.browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080
    });

    return page;
  }

  /**
   * 获取所有页面
   */
  async pages() {
    if (!this.browser) {
      throw new Error('浏览器未连接');
    }

    return await this.browser.pages();
  }

  /**
   * 关闭连接（不关闭浏览器，只是断开连接）
   */
  async disconnect() {
    if (this.browser) {
      await this.browser.disconnect();
      logger.info('已断开与Edge的连接');
      this.browser = null;
    }
  }

  /**
   * 检查浏览器是否已连接
   */
  isConnected() {
    return this.browser !== null && this.browser.isConnected();
  }
}
