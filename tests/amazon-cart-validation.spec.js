const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const HomePage = require('../pages/HomePage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const ProductPage = require('../pages/ProductPage');
const CartPage = require('../pages/CartPage');
const TestEnvironment = require('../config/test-environments');
const testData = require('../test-data/products.json');

test.describe('Amazon Cart Validation Tests', () => {
  let homePage;
  let searchResultsPage;
  let productPage;
  let cartPage;
  let country;

  test.beforeEach(async ({ page }) => {
    const countryCode = process.env.COUNTRY;
    country = new TestEnvironment(countryCode);
    homePage = new HomePage(page, country);
    searchResultsPage = new SearchResultsPage(page, country);
    productPage = new ProductPage(page, country);
    cartPage = new CartPage(page, country);
    
    await allure.epic('Amazon Shopping');
    await allure.feature('Cart Validation');
  });

  test('Verify cart icon shows correct count after adding item', async () => {
    await allure.story('Cart Count Validation');
    await allure.severity('critical');
    await allure.owner('QA Team');
    
    // Navigate to homepage
    await homePage.navigate('/');
    await homePage.waitForPageLoad();
    
    // Get initial cart count
    const initialCartCount = await homePage.getCartCount();
    
    // Search and add product using test data
    const language = country.getLanguage();
    const countryCode = process.env.COUNTRY;
    const searchTerms = testData[language]?.searchTerms || testData[countryCode]?.searchTerms || ['laptop'];
    const searchTerm = searchTerms[0];
    await homePage.searchForProduct(searchTerm);
    
    const hasResults = await searchResultsPage.hasSearchResults();
    expect(hasResults).toBeTruthy();
    
    await searchResultsPage.clickFirstProduct();
    await productPage.addToCart(1);
    
    // Wait for cart to update
    await homePage.page.waitForTimeout(2000);
    
    // Verify cart count increased
    const newCartCount = await homePage.getCartCount();
    expect(newCartCount).toBeGreaterThan(initialCartCount);
  });

  test('Verify product information in cart matches product page', async () => {
    await allure.story('Product Information Consistency');
    await allure.severity('normal');
    
    // Navigate and search
    await homePage.navigate('/');
    await homePage.waitForPageLoad();
    
    // Get search term from test data
    const language = country.getLanguage();
    const countryCode = process.env.COUNTRY;
    const searchTerms = testData[language]?.searchTerms || testData[countryCode]?.searchTerms || ['headphones'];
    const searchTerm = searchTerms[1] || searchTerms[0];
    await homePage.searchForProduct(searchTerm);
    
    const hasResults = await searchResultsPage.hasSearchResults();
    expect(hasResults).toBeTruthy();
    
    await searchResultsPage.clickFirstProduct();
    
    // Get product details from product page
    const productTitle = await productPage.getProductTitle();
    expect(productTitle).toBeTruthy();
    
    const productPrice = await productPage.getProductPrice();
    expect(productPrice).toBeTruthy();
    
    // Add to cart
    await productPage.addToCart(1);
    
    // Go to cart
    await productPage.goToCart();
    
    // Verify product is in cart
    const isProductInCart = await cartPage.isProductInCart(productTitle);
    expect(isProductInCart).toBeTruthy();
    
    // Verify cart has items
    const cartItemsCount = await cartPage.getCartItemsCount();
    expect(cartItemsCount).toBeGreaterThan(0);
  });

  test('Verify cart page displays subtotal correctly', async () => {
    await allure.story('Cart Subtotal Display');
    await allure.severity('normal');
    
    // Navigate and add product
    await homePage.navigate('/');
    await homePage.waitForPageLoad();
    
    // Get search term from test data
    const language = country.getLanguage();
    const countryCode = process.env.COUNTRY;
    const searchTerms = testData[language]?.searchTerms || testData[countryCode]?.searchTerms || ['mouse'];
    const searchTerm = searchTerms[2] || searchTerms[0];
    await homePage.searchForProduct(searchTerm);
    
    const hasResults = await searchResultsPage.hasSearchResults();
    expect(hasResults).toBeTruthy();
    
    await searchResultsPage.clickFirstProduct();
    await productPage.addToCart(1);
    await productPage.goToCart();
    
    // Verify subtotal is displayed
    const subtotal = await cartPage.getSubtotal();
    expect(subtotal).toBeTruthy();
    expect(subtotal.length).toBeGreaterThan(0);
  });

  test('Verify empty cart state', async () => {
    await allure.story('Empty Cart Validation');
    await allure.severity('normal');
    
    // Navigate directly to cart
    await homePage.navigate('/gp/cart/view.html');
    await homePage.waitForPageLoad();
    
    // Check if cart is empty (might be empty or might have items from previous tests)
    const isEmpty = await cartPage.isEmpty();
    const cartItemsCount = await cartPage.getCartItemsCount();
    
    // Verify cart state is consistent
    if (isEmpty) {
      expect(cartItemsCount).toBe(0);
    } else {
      expect(cartItemsCount).toBeGreaterThan(0);
    }
  });

  test('Verify cart navigation from homepage', async () => {
    await allure.story('Cart Navigation');
    await allure.severity('normal');
    
    // Navigate to homepage
    await homePage.navigate('/');
    await homePage.waitForPageLoad();
    
    // Navigate to cart
    await homePage.navigateToCart();
    
    // Verify cart page loaded
    await expect(homePage.page).toHaveURL(/\/cart\/|gp\/cart\/view/);
  });
});

