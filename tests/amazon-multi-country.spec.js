const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const HomePage = require('../pages/HomePage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const TestEnvironment = require('../config/test-environments');
const countries = require('../config/countries.json');

// Test across all configured countries
Object.keys(countries).forEach(countryCode => {
  test.describe(`Amazon Tests - ${countryCode.toUpperCase()}`, () => {
    let homePage;
    let searchResultsPage;
    let country;

    test.beforeEach(async ({ page }) => {
      country = new TestEnvironment(countryCode);
      homePage = new HomePage(page, country);
      searchResultsPage = new SearchResultsPage(page, country);
      
      await allure.epic('Multi-Country Testing');
      await allure.feature(`Amazon ${countryCode.toUpperCase()}`);
      await allure.owner('QA Team');
      
      await homePage.navigate('/');
      await homePage.waitForPageLoad();
    });

    test(`Verify ${countryCode} homepage loads correctly`, async () => {
      await allure.story('Homepage Load');
      await allure.severity('critical');
      
      // Verify correct URL
      const currentUrl = homePage.page.url();
      expect(currentUrl).toContain(country.getBaseUrl());
      
      // Verify logo is visible
      const isLogoVisible = await homePage.isLogoVisible();
      expect(isLogoVisible).toBeTruthy();
      
      // Verify search input is visible
      const isSearchVisible = await homePage.isSearchInputVisible();
      expect(isSearchVisible).toBeTruthy();
    });

    test(`Search functionality works for ${countryCode}`, async () => {
      await allure.story('Search Functionality');
      await allure.severity('critical');
      
      const searchTerm = 'laptop';
      await homePage.searchForProduct(searchTerm);
      
      // Verify search results page loaded
      await expect(homePage.page).toHaveURL(/s\?k=/);
      
      // Verify search results are displayed
      const hasResults = await searchResultsPage.hasSearchResults();
      expect(hasResults).toBeTruthy();
      
      const resultsCount = await searchResultsPage.getSearchResultsCount();
      expect(resultsCount).toBeGreaterThan(0);
    });

    test(`Verify ${countryCode} locale and currency settings`, async () => {
      await allure.story('Locale and Currency');
      await allure.severity('normal');
      
      // Verify locale
      const locale = country.getLocale();
      expect(locale).toBe(countries[countryCode].locale);
      
      // Verify currency
      const currency = country.getCurrency();
      expect(currency).toBe(countries[countryCode].currency);
      
      // Verify language
      const language = country.getLanguage();
      expect(language).toBe(countries[countryCode].language);
    });
  });
});

