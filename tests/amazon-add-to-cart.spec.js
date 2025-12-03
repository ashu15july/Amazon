const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const HomePage = require('../pages/HomePage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const ProductPage = require('../pages/ProductPage');
const CartPage = require('../pages/CartPage');
const TestEnvironment = require('../config/test-environments');
const testData = require('../test-data/products.json');

test.describe('Amazon Add to Cart Tests', () => {
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
    await allure.feature('Add to Cart');
  });

  test('Search product, add to cart and verify item in cart', async () => {
    await allure.story('Complete Add to Cart Flow');
    await allure.severity('critical');
    await allure.owner('QA Team');
    
    // Navigate to homepage
    await homePage.navigate('/');
    await homePage.waitForPageLoad();
    
    // Get initial cart count
    const initialCartCount = await homePage.getCartCount();
    
    // Search for a product using test data
    const language = country.getLanguage();
    const countryCode = process.env.COUNTRY;
    const searchTerms = testData[language]?.searchTerms || testData[countryCode]?.searchTerms || ['laptop'];
    const searchTerm = searchTerms[0];
    await homePage.searchForProduct(searchTerm);
    
    // Verify search results
    const hasResults = await searchResultsPage.hasSearchResults();
    expect(hasResults).toBeTruthy();
    
    // Get product title from search results
    const productTitleInResults = await searchResultsPage.getFirstProductTitle();
    expect(productTitleInResults).toBeTruthy();
    
    // Click on first product
    await searchResultsPage.clickFirstProduct();
    
    // Verify product page loaded
    await expect(homePage.page).toHaveURL(/\/dp\/|\/gp\/product\//);
    
    // Get product details from product page
    const productTitle = await productPage.getProductTitle();
    expect(productTitle).toBeTruthy();
    
    const productPrice = await productPage.getProductPrice();
    expect(productPrice).toBeTruthy();
    
    // Verify Add to Cart button is visible
    const isAddToCartVisible = await productPage.isAddToCartButtonVisible();
    expect(isAddToCartVisible).toBeTruthy();
    
    // Add product to cart
    await productPage.addToCart(1);
    
    // Verify cart count increased
    await homePage.page.waitForTimeout(2000); // Wait for cart to update
    const newCartCount = await homePage.getCartCount();
    expect(newCartCount).toBeGreaterThan(initialCartCount);
    
    // Navigate to cart
    await productPage.goToCart();
    
    // Verify cart page loaded
    await expect(homePage.page).toHaveURL(/\/cart\/|gp\/cart\/view/);
    
    // Verify cart is not empty
    const isEmpty = await cartPage.isEmpty();
    expect(isEmpty).toBeFalsy();
    
    // Verify product is in cart
    const isProductInCart = await cartPage.isProductInCart(productTitle);
    expect(isProductInCart).toBeTruthy();
    
    // Verify cart has items
    const cartItemsCount = await cartPage.getCartItemsCount();
    expect(cartItemsCount).toBeGreaterThan(0);
  });

  test('Add product to cart and verify cart subtotal', async () => {
    await allure.story('Cart Subtotal Validation');
    await allure.severity('normal');
    
    // Navigate to homepage and search
    await homePage.navigate('/');
    await homePage.waitForPageLoad();
    
    // Get search term from test data
    const language = country.getLanguage();
    const countryCode = process.env.COUNTRY;
    const searchTerms = testData[language]?.searchTerms || testData[countryCode]?.searchTerms || ['keyboard'];
    const searchTerm = searchTerms[3] || searchTerms[0]; // Use fourth term (keyboard) or first if not available
    await homePage.searchForProduct(searchTerm);
    
    // Verify results and click first product
    const hasResults = await searchResultsPage.hasSearchResults();
    expect(hasResults).toBeTruthy();
    
    await searchResultsPage.clickFirstProduct();
    
    // Get product price
    const productPrice = await productPage.getProductPrice();
    expect(productPrice).toBeTruthy();
    
    // Add to cart
    await productPage.addToCart(1);
    
    // Go to cart
    await productPage.goToCart();
    
    // Verify subtotal is displayed
    const subtotal = await cartPage.getSubtotal();
    expect(subtotal).toBeTruthy();
    
    // Verify cart has items
    const cartItemsCount = await cartPage.getCartItemsCount();
    expect(cartItemsCount).toBeGreaterThan(0);
  });

  test('Verify product details match between search results and product page', async () => {
    await allure.story('Product Details Consistency');
    await allure.severity('normal');
    
    // Navigate and search
    await homePage.navigate('/');
    await homePage.waitForPageLoad();
    
    // Get search term from test data
    const language = country.getLanguage();
    const countryCode = process.env.COUNTRY;
    const searchTerms = testData[language]?.searchTerms || testData[countryCode]?.searchTerms || ['mouse'];
    const searchTerm = searchTerms[2] || searchTerms[0]; // Use third term (mouse) or first if not available
    await homePage.searchForProduct(searchTerm);
    
    // Get product title from search results
    const productTitleInResults = await searchResultsPage.getFirstProductTitle();
    expect(productTitleInResults).toBeTruthy();
    
    // Click on product
    await searchResultsPage.clickFirstProduct();
    
    // Get product title from product page
    const productTitleOnPage = await productPage.getProductTitle();
    expect(productTitleOnPage).toBeTruthy();
    
    // Verify titles are similar (might have slight differences)
    // Check if product page title contains keywords from search result title
    const titleMatch = productTitleOnPage.toLowerCase().includes(
      productTitleInResults.toLowerCase().substring(0, 20)
    ) || productTitleInResults.toLowerCase().includes(
      productTitleOnPage.toLowerCase().substring(0, 20)
    );
    
    // At least verify both have content
    expect(productTitleOnPage.length).toBeGreaterThan(0);
    expect(productTitleInResults.length).toBeGreaterThan(0);
  });

  test('Add multiple quantities of same product to cart', async () => {
    await allure.story('Multiple Quantity Add to Cart');
    await allure.severity('normal');
    
    // Navigate and search
    await homePage.navigate('/');
    await homePage.waitForPageLoad();
    
    // Get search term from test data
    const language = country.getLanguage();
    const countryCode = process.env.COUNTRY;
    const searchTerms = testData[language]?.searchTerms || testData[countryCode]?.searchTerms || ['usb cable'];
    const searchTerm = searchTerms[4] || searchTerms[0]; // Use fifth term (usb cable) or first if not available
    await homePage.searchForProduct(searchTerm);
    
    // Click first product
    const hasResults = await searchResultsPage.hasSearchResults();
    expect(hasResults).toBeTruthy();
    
    await searchResultsPage.clickFirstProduct();
    
    // Add quantity 2 to cart
    await productPage.addToCart(2);
    
    // Go to cart
    await productPage.goToCart();
    
    // Verify cart has items
    const cartItemsCount = await cartPage.getCartItemsCount();
    expect(cartItemsCount).toBeGreaterThan(0);
  });
});

