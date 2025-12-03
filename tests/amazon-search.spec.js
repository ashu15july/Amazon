const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const HomePage = require('../pages/HomePage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const TestEnvironment = require('../config/test-environments');
const testData = require('../test-data/products.json');

test.describe('Amazon Search Tests', () => {
  let homePage;
  let searchResultsPage;
  let country;

  test.beforeEach(async ({ page }) => {
    const countryCode = process.env.COUNTRY;
    country = new TestEnvironment(countryCode);
    homePage = new HomePage(page, country);
    searchResultsPage = new SearchResultsPage(page, country);
    
    await allure.epic('Amazon Shopping');
    await allure.feature('Product Search');
    await homePage.navigate('/');
    await homePage.waitForPageLoad();
  });

  test('Search for a product and verify results are displayed', async () => {
    await allure.story('Search Results Display');
    await allure.severity('critical');
    await allure.owner('QA Team');
    
    // Get search term from test data based on language
    const language = country.getLanguage();
    const searchTerms = testData[language]?.searchTerms || testData[process.env.COUNTRY]?.searchTerms || ['laptop'];
    const searchTerm = searchTerms[0];
    await homePage.searchForProduct(searchTerm);
    
    // Verify search results page loaded
    await expect(homePage.page).toHaveURL(/s\?k=/);
    
    // Verify search results are displayed
    const hasResults = await searchResultsPage.hasSearchResults();
    expect(hasResults).toBeTruthy();
    
    // Verify at least one result is visible
    const resultsCount = await searchResultsPage.getSearchResultsCount();
    expect(resultsCount).toBeGreaterThan(0);
  });

  test('Search for product and verify product details in results', async () => {
    await allure.story('Product Details in Search');
    await allure.severity('normal');
    
    // Get search term from test data
    const language = country.getLanguage();
    const searchTerms = testData[language]?.searchTerms || testData[process.env.COUNTRY]?.searchTerms || ['headphones'];
    const searchTerm = searchTerms[1] || searchTerms[0]; // Use second term (headphones) or first if not available
    await homePage.searchForProduct(searchTerm);
    
    // Verify search results are displayed
    const hasResults = await searchResultsPage.hasSearchResults();
    expect(hasResults).toBeTruthy();
    
    // Verify first product has title
    const productTitle = await searchResultsPage.getFirstProductTitle();
    expect(productTitle).toBeTruthy();
    expect(productTitle.length).toBeGreaterThan(0);
    
    // Verify first product has price
    const productPrice = await searchResultsPage.getFirstProductPrice();
    expect(productPrice).toBeTruthy();
  });

  test('Click on first search result and verify product page loads', async () => {
    await allure.story('Navigate to Product Page');
    await allure.severity('critical');
    
    // Get search term from test data
    const language = country.getLanguage();
    const searchTerms = testData[language]?.searchTerms || testData[process.env.COUNTRY]?.searchTerms || ['mouse'];
    const searchTerm = searchTerms[2] || searchTerms[0]; // Use third term (mouse) or first if not available
    await homePage.searchForProduct(searchTerm);
    
    // Verify results are displayed
    const hasResults = await searchResultsPage.hasSearchResults();
    expect(hasResults).toBeTruthy();
    
    // Get product title from search results
    const productTitleInResults = await searchResultsPage.getFirstProductTitle();
    expect(productTitleInResults).toBeTruthy();
    
    // Click on first product
    await searchResultsPage.clickFirstProduct();
    
    // Verify product page loaded (URL should contain /dp/ or /gp/product/)
    await expect(homePage.page).toHaveURL(/\/dp\/|\/gp\/product\//);
  });

  test('Verify homepage search input is visible and functional', async () => {
    await allure.story('Search Input Validation');
    await allure.severity('normal');
    
    // Verify search input is visible
    const isSearchVisible = await homePage.isSearchInputVisible();
    expect(isSearchVisible).toBeTruthy();
    
    // Verify logo is visible
    const isLogoVisible = await homePage.isLogoVisible();
    expect(isLogoVisible).toBeTruthy();
  });
});

