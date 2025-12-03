const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const HomePage = require('../pages/HomePage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const ProductPage = require('../pages/ProductPage');
const TestEnvironment = require('../config/test-environments');
const products = require('../test-data/products.json');

test.describe('Product Tests', () => {
  let homePage;
  let searchResultsPage;
  let productPage;
  let country;

  test.beforeEach(async ({ page }) => {
    country = new TestEnvironment(process.env.COUNTRY);
    homePage = new HomePage(page, country);
    searchResultsPage = new SearchResultsPage(page, country);
    productPage = new ProductPage(page, country);
    
    await allure.epic('Product Management');
    await allure.feature('Product Details');
    
    // Navigate to homepage and search for a product to get to product page
    await homePage.navigate('/');
    await homePage.waitForPageLoad();
    
    // Get search term from test data
    const language = country.getLanguage();
    const countryCode = process.env.COUNTRY;
    const searchTerms = products[language]?.searchTerms || products[countryCode]?.searchTerms || ['laptop'];
    await homePage.searchForProduct(searchTerms[0]);
    
    // Click on first product
    const hasResults = await searchResultsPage.hasSearchResults();
    if (hasResults) {
      await searchResultsPage.clickFirstProduct();
      await productPage.waitForPageLoad();
    }
  });

  test('Product page displays product information', async () => {
    await allure.story('Product Display');
    await allure.severity('critical');
    
    const title = await productPage.getProductTitle();
    const price = await productPage.getProductPrice();
    
    expect(title).toBeTruthy();
    expect(price).toBeTruthy();
  });

  test('Add product to cart', async () => {
    await allure.story('Add to Cart');
    await allure.severity('critical');
    
    await productPage.addToCart(1);
    
    // Verify cart update or success message
    // This would depend on your application's behavior
  });

  test('Add multiple products to cart', async () => {
    await allure.story('Multiple Items');
    await allure.severity('normal');
    
    await productPage.addToCart(3);
    
    // Verify cart update with correct quantity
  });
});

