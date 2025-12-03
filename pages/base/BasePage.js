const { expect } = require('@playwright/test');

class BasePage {
  constructor(page, country) {
    this.page = page;
    this.country = country;
  }

  async navigate(path = '', options = {}) {
    const defaultOptions = {
      waitUntil: 'domcontentloaded', // More reliable than 'networkidle' for Amazon
      timeout: 30000
    };
    await this.page.goto(`${this.country.getBaseUrl()}${path}`, { ...defaultOptions, ...options });
  }

  async waitForPageLoad(timeout = 30000) {
    try {
      // Wait for DOM to be ready first
      await this.page.waitForLoadState('domcontentloaded', { timeout: Math.min(timeout, 15000) });
      
      // Try to wait for load state (page resources loaded)
      await this.page.waitForLoadState('load', { timeout: Math.min(timeout, 10000) });
      
      // For Amazon, networkidle often never happens due to continuous requests
      // So we skip it and just wait a short time for page to stabilize
      await this.page.waitForTimeout(1000);
    } catch (error) {
      // If timeout occurs, just wait a short time for page to stabilize
      console.log('Page load timeout, waiting for stabilization...');
      await this.page.waitForTimeout(2000);
    }
  }

  async clickElement(locator) {
    await this.page.locator(locator).click();
  }

  async fillInput(locator, text) {
    await this.page.locator(locator).fill(text);
  }

  async getText(locator) {
    return await this.page.locator(locator).textContent();
  }

  async isVisible(locator) {
    return await this.page.locator(locator).isVisible();
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ 
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  // Self-healing locator method
  async findElementWithHealing(primaryLocator, alternativeLocators = []) {
    try {
      await this.page.locator(primaryLocator).waitFor({ timeout: 5000 });
      return primaryLocator;
    } catch (error) {
      for (const altLocator of alternativeLocators) {
        try {
          await this.page.locator(altLocator).waitFor({ timeout: 3000 });
          console.log(`Healed locator: Using ${altLocator} instead of ${primaryLocator}`);
          return altLocator;
        } catch (e) {
          continue;
        }
      }
      throw new Error(`All locators failed for element: ${primaryLocator}`);
    }
  }
}

module.exports = BasePage;

