const BasePage = require('./base/BasePage');

class SearchResultsPage extends BasePage {
  constructor(page, country) {
    super(page, country);
    
    // Amazon search results locators
    this.searchResults = '[data-component-type="s-search-result"]';
    this.firstProduct = '[data-component-type="s-search-result"]:first-of-type';
    this.productTitle = 'h2 a span';
    this.productPrice = '.a-price-whole, .a-price .a-offscreen';
    this.productImage = 'img.s-image';
    this.noResultsMessage = '.s-no-outline';
    this.resultCount = '#search > span > h1 > div > div.sg-col-14-of-20 > div > span';
    
    // Alternative locators
    this.searchResultsAlts = ['.s-result-item', '[data-index]'];
  }

  async getSearchResultsCount() {
    try {
      const results = await this.page.locator(this.searchResults).count();
      return results;
    } catch (error) {
      return 0;
    }
  }

  async clickFirstProduct() {
    try {
      // Wait for search results to load
      await this.page.waitForSelector(this.searchResults, { timeout: 10000 });
      
      // Click on the first product's title link
      const firstProduct = this.page.locator(this.firstProduct);
      const productLink = firstProduct.locator(this.productTitle).first();
      
      await productLink.click();
      await this.waitForPageLoad();
    } catch (error) {
      throw new Error(`Failed to click first product: ${error.message}`);
    }
  }

  async getFirstProductTitle() {
    try {
      await this.page.waitForSelector(this.firstProduct, { timeout: 10000 });
      const titleElement = this.page.locator(this.firstProduct).locator(this.productTitle).first();
      return await titleElement.textContent();
    } catch (error) {
      return null;
    }
  }

  async getFirstProductPrice() {
    try {
      await this.page.waitForSelector(this.firstProduct, { timeout: 10000 });
      const priceElement = this.page.locator(this.firstProduct).locator(this.productPrice).first();
      const priceText = await priceElement.textContent();
      return priceText ? priceText.trim() : null;
    } catch (error) {
      return null;
    }
  }

  async hasSearchResults() {
    const count = await this.getSearchResultsCount();
    return count > 0;
  }

  async clickProductByIndex(index) {
    try {
      await this.page.waitForSelector(this.searchResults, { timeout: 10000 });
      const product = this.page.locator(this.searchResults).nth(index);
      const productLink = product.locator(this.productTitle).first();
      await productLink.click();
      await this.waitForPageLoad();
    } catch (error) {
      throw new Error(`Failed to click product at index ${index}: ${error.message}`);
    }
  }
}

module.exports = SearchResultsPage;

