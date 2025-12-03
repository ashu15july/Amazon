class LocatorHealer {
  constructor(page) {
    this.page = page;
    this.healingLog = [];
  }

  async findElement(primaryLocator, alternatives = [], timeout = 5000) {
    // Try primary locator
    try {
      const element = this.page.locator(primaryLocator);
      await element.waitFor({ state: 'visible', timeout });
      return { locator: primaryLocator, healed: false };
    } catch (primaryError) {
      console.log(`Primary locator failed: ${primaryLocator}`);
      
      // Try alternative locators
      for (const altLocator of alternatives) {
        try {
          const element = this.page.locator(altLocator);
          await element.waitFor({ state: 'visible', timeout: 3000 });
          
          this.logHealing(primaryLocator, altLocator);
          return { locator: altLocator, healed: true };
        } catch (altError) {
          continue;
        }
      }
      
      // Try attribute-based healing
      const healedLocator = await this.tryAttributeBasedHealing(primaryLocator);
      if (healedLocator) {
        this.logHealing(primaryLocator, healedLocator);
        return { locator: healedLocator, healed: true };
      }
      
      throw new Error(`All locators failed for: ${primaryLocator}`);
    }
  }

  async tryAttributeBasedHealing(originalLocator) {
    // Extract attributes from original locator
    const strategies = [
      this.tryByText.bind(this),
      this.tryByRole.bind(this),
      this.tryByTestId.bind(this),
      this.tryByPlaceholder.bind(this)
    ];

    for (const strategy of strategies) {
      try {
        const locator = await strategy(originalLocator);
        if (locator) return locator;
      } catch (e) {
        continue;
      }
    }
    return null;
  }

  async tryByText(originalLocator) {
    // Implementation for text-based healing
    // Extract text from locator if possible
    const textMatch = originalLocator.match(/text=["']([^"']+)["']/);
    if (textMatch) {
      try {
        const element = this.page.locator(`text=${textMatch[1]}`);
        await element.waitFor({ state: 'visible', timeout: 3000 });
        return `text=${textMatch[1]}`;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  async tryByRole(originalLocator) {
    // Implementation for role-based healing
    // Try to find by role if button/link/etc
    const roleMatch = originalLocator.match(/button|link|input|select/);
    if (roleMatch) {
      // This is a simplified example - actual implementation would be more complex
      return null;
    }
    return null;
  }

  async tryByTestId(originalLocator) {
    // Try to find element by data-testid
    const testIdMatch = originalLocator.match(/\[data-testid=["']([^"']+)["']\]/);
    if (testIdMatch) {
      try {
        const element = this.page.locator(`[data-testid="${testIdMatch[1]}"]`);
        await element.waitFor({ state: 'visible', timeout: 3000 });
        return `[data-testid="${testIdMatch[1]}"]`;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  async tryByPlaceholder(originalLocator) {
    // Implementation for placeholder-based healing
    const placeholderMatch = originalLocator.match(/\[placeholder=["']([^"']+)["']\]/);
    if (placeholderMatch) {
      try {
        const element = this.page.locator(`[placeholder="${placeholderMatch[1]}"]`);
        await element.waitFor({ state: 'visible', timeout: 3000 });
        return `[placeholder="${placeholderMatch[1]}"]`;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  logHealing(original, healed) {
    const log = {
      timestamp: new Date().toISOString(),
      original,
      healed,
      testName: process.env.TEST_NAME || 'unknown'
    };
    this.healingLog.push(log);
    console.log(`🔧 Locator Healed: ${original} → ${healed}`);
  }

  getHealingReport() {
    return this.healingLog;
  }
}

module.exports = LocatorHealer;

