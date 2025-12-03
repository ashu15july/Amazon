const BasePage = require('./base/BasePage');

class CartPage extends BasePage {
  constructor(page, country) {
    super(page, country);
    
    // Amazon cart page locators
    this.cartItems = '[data-item-count]';
    this.cartItem = '.sc-list-item';
    this.productTitleInCart = '.sc-product-title';
    this.productPriceInCart = '.sc-product-price';
    this.quantityDropdown = '.a-dropdown-prompt';
    this.deleteButton = 'input[value="Delete"]';
    this.subtotal = '#sc-subtotal-amount-activecart';
    this.emptyCartMessage = '.sc-empty-cart-message';
    this.proceedToCheckout = '#sc-buy-box-ptc-button, input[name="proceedToRetailCheckout"]';
    
    // Alternative locators
    this.cartItemsAlts = ['.sc-list-item-content', '[data-asin]'];
  }

  async getCartItemsCount() {
    try {
      await this.page.waitForSelector(this.cartItems, { timeout: 5000 });
      const items = await this.page.locator(this.cartItems).count();
      return items;
    } catch (error) {
      // Try alternative selector
      try {
        const items = await this.page.locator(this.cartItem).count();
        return items;
      } catch (e) {
        return 0;
      }
    }
  }

  async getFirstProductTitle() {
    try {
      const titleElement = this.page.locator(this.productTitleInCart).first();
      return await titleElement.textContent();
    } catch (error) {
      return null;
    }
  }

  async getFirstProductPrice() {
    try {
      const priceElement = this.page.locator(this.productPriceInCart).first();
      const priceText = await priceElement.textContent();
      return priceText ? priceText.trim() : null;
    } catch (error) {
      return null;
    }
  }

  async getSubtotal() {
    try {
      const subtotalElement = this.page.locator(this.subtotal);
      const subtotalText = await subtotalElement.textContent();
      return subtotalText ? subtotalText.trim() : null;
    } catch (error) {
      return null;
    }
  }

  async deleteFirstItem() {
    try {
      const deleteBtn = this.page.locator(this.deleteButton).first();
      if (await deleteBtn.isVisible({ timeout: 3000 })) {
        await deleteBtn.click();
        await this.page.waitForTimeout(1000);
        await this.waitForPageLoad();
      }
    } catch (error) {
      throw new Error(`Failed to delete item: ${error.message}`);
    }
  }

  async isEmpty() {
    try {
      const emptyMessage = await this.page.locator(this.emptyCartMessage).isVisible({ timeout: 2000 });
      return emptyMessage;
    } catch (error) {
      const itemCount = await this.getCartItemsCount();
      return itemCount === 0;
    }
  }

  async isProductInCart(productTitle) {
    try {
      const titles = await this.page.locator(this.productTitleInCart).allTextContents();
      return titles.some(title => title.toLowerCase().includes(productTitle.toLowerCase()));
    } catch (error) {
      return false;
    }
  }

  async proceedToCheckout() {
    try {
      const checkoutButton = this.page.locator(this.proceedToCheckout);
      if (await checkoutButton.isVisible({ timeout: 5000 })) {
        await checkoutButton.click();
        await this.waitForPageLoad();
      } else {
        throw new Error('Proceed to checkout button not found');
      }
    } catch (error) {
      throw new Error(`Failed to proceed to checkout: ${error.message}`);
    }
  }

  async updateQuantity(index, quantity) {
    try {
      const quantityDropdowns = await this.page.locator(this.quantityDropdown).all();
      if (quantityDropdowns[index]) {
        await quantityDropdowns[index].click();
        await this.page.locator(`option[value="${quantity}"]`).click();
        await this.page.waitForTimeout(1000);
      }
    } catch (error) {
      throw new Error(`Failed to update quantity: ${error.message}`);
    }
  }
}

module.exports = CartPage;

