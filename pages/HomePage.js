const BasePage = require('./base/BasePage');

class HomePage extends BasePage {
  constructor(page, country) {
    super(page, country);
    
    // Amazon-specific locators
    this.logo = '#nav-logo-sprites';
    this.searchInput = '#twotabsearchtextbox';
    this.searchButton = '#nav-search-submit-button';
    this.searchDropdown = '#searchDropdownBox';
    this.cartIcon = '#nav-cart-count';
    this.cartLink = '#nav-cart';
    this.accountList = '#nav-link-accountList';
    this.acceptCookies = '#sp-cc-accept'; // Cookie consent button (if present)
    
    // Alternative locators for self-healing
    this.logoAlts = ['a[aria-label*="Amazon"]', '.nav-logo-link', '[data-csa-c-content-id="nav_swm"]'];
    this.searchInputAlts = ['input[name="field-keywords"]', '#nav-bb-search'];
    this.searchButtonAlts = ['input[type="submit"][value*="Go"]', 'button[type="submit"]'];
  }

  async acceptCookiesIfPresent() {
    try {
      const cookieButton = this.page.locator(this.acceptCookies);
      if (await cookieButton.isVisible({ timeout: 3000 })) {
        await cookieButton.click();
        await this.page.waitForTimeout(1000);
      }
    } catch (error) {
      // Cookie banner not present, continue
    }
  }

  async searchForProduct(searchTerm) {
    // Accept cookies if present
    await this.acceptCookiesIfPresent();
    
    const searchLoc = await this.findElementWithHealing(this.searchInput, this.searchInputAlts);
    await this.fillInput(searchLoc, searchTerm);
    
    const buttonLoc = await this.findElementWithHealing(this.searchButton, this.searchButtonAlts);
    await this.clickElement(buttonLoc);
    await this.waitForPageLoad();
  }

  async isLogoVisible() {
    try {
      const logoLoc = await this.findElementWithHealing(this.logo, this.logoAlts);
      return await this.isVisible(logoLoc);
    } catch (error) {
      // Try alternative check
      return await this.page.locator('a[aria-label*="Amazon"]').isVisible().catch(() => false);
    }
  }

  async getCartCount() {
    try {
      const cartText = await this.page.locator(this.cartIcon).textContent();
      return parseInt(cartText) || 0;
    } catch (error) {
      return 0;
    }
  }

  async navigateToCart() {
    await this.clickElement(this.cartLink);
    await this.waitForPageLoad();
  }

  async isSearchInputVisible() {
    const searchLoc = await this.findElementWithHealing(this.searchInput, this.searchInputAlts);
    return await this.isVisible(searchLoc);
  }
}

module.exports = HomePage;

