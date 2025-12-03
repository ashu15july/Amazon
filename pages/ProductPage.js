const BasePage = require('./base/BasePage');

class ProductPage extends BasePage {
  constructor(page, country) {
    super(page, country);
    
    // Amazon product page locators
    this.productTitle = '#productTitle';
    this.productPrice = '#priceblock_ourprice, #priceblock_dealprice, .a-price .a-offscreen, .a-price-whole';
    this.addToCartButton = '#add-to-cart-button';
    this.buyNowButton = '#buy-now-button';
    this.quantityDropdown = '#quantity';
    this.productDescription = '#feature-bullets, #productDescription';
    this.addedToCartMessage = '#NATC_SMART_WAGON_CONF_MSG_SUCCESS';
    this.cartSubtotal = '#attach-accessory-cart-subtotal';
    this.goToCartButton = '#attach-sidesheet-view-cart-button, #sw-gtc';
    
    // Alternative locators for self-healing
    this.addToCartButtonAlts = [
      'input[name="submit.add-to-cart"]',
      '#add-to-cart-button-ubb',
      'button:has-text("Add to Cart")',
      'span:has-text("Add to Cart")'
    ];
    this.productTitleAlts = ['h1.a-size-large', '.a-size-large.product-title-word-break'];
  }

  async getProductTitle() {
    try {
      const titleLoc = await this.findElementWithHealing(this.productTitle, this.productTitleAlts);
      return await this.getText(titleLoc);
    } catch (error) {
      return null;
    }
  }

  async getProductPrice() {
    try {
      // Try multiple price locators
      const priceSelectors = [
        '#priceblock_ourprice',
        '#priceblock_dealprice',
        '.a-price .a-offscreen',
        '.a-price-whole',
        '#price'
      ];
      
      for (const selector of priceSelectors) {
        try {
          const priceElement = this.page.locator(selector).first();
          if (await priceElement.isVisible({ timeout: 2000 })) {
            const priceText = await priceElement.textContent();
            if (priceText) return priceText.trim();
          }
        } catch (e) {
          continue;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async addToCart(quantity = 1) {
    try {
      // Set quantity if more than 1
      if (quantity > 1) {
        try {
          const quantityDropdown = this.page.locator(this.quantityDropdown);
          if (await quantityDropdown.isVisible({ timeout: 3000 })) {
            await quantityDropdown.selectOption(quantity.toString());
            await this.page.waitForTimeout(500);
          }
        } catch (error) {
          console.log('Quantity dropdown not found or not changeable');
        }
      }
      
      // Click add to cart button
      const buttonLoc = await this.findElementWithHealing(this.addToCartButton, this.addToCartButtonAlts);
      await this.clickElement(buttonLoc);
      
      // Wait for cart confirmation or side panel
      try {
        await this.page.waitForSelector(this.addedToCartMessage, { timeout: 5000 });
      } catch (error) {
        // Message might not appear, continue
      }
      
      await this.page.waitForTimeout(1000);
    } catch (error) {
      throw new Error(`Failed to add product to cart: ${error.message}`);
    }
  }

  async goToCart() {
    try {
      // Try to click "Go to Cart" button if it appears
      const goToCartButton = this.page.locator(this.goToCartButton);
      if (await goToCartButton.isVisible({ timeout: 3000 })) {
        await goToCartButton.click();
        await this.waitForPageLoad();
      } else {
        // Navigate to cart directly
        await this.page.goto(`${this.country.getBaseUrl()}/gp/cart/view.html`);
        await this.waitForPageLoad();
      }
    } catch (error) {
      // Fallback: navigate to cart
      await this.page.goto(`${this.country.getBaseUrl()}/gp/cart/view.html`);
      await this.waitForPageLoad();
    }
  }

  async isAddToCartButtonVisible() {
    try {
      const buttonLoc = await this.findElementWithHealing(this.addToCartButton, this.addToCartButtonAlts);
      return await this.isVisible(buttonLoc);
    } catch (error) {
      return false;
    }
  }

  async getProductDescription() {
    try {
      return await this.getText(this.productDescription);
    } catch (error) {
      return null;
    }
  }
}

module.exports = ProductPage;


