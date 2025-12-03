const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const HomePage = require('../pages/HomePage');
const TestEnvironment = require('../config/test-environments');

test.describe('Amazon Homepage Tests', () => {
  let homePage;
  let country;

  test.beforeEach(async ({ page }) => {
    const countryCode = process.env.COUNTRY;
    country = new TestEnvironment(countryCode);
    homePage = new HomePage(page, country);
    
    await allure.epic('Amazon Homepage');
    await allure.feature('Navigation');
    await homePage.navigate('/');
    await homePage.waitForPageLoad();
  });

  test('Amazon homepage loads successfully', async () => {
    await allure.story('Page Load');
    await allure.severity('critical');
    
    // Verify correct URL
    const currentUrl = homePage.page.url();
    expect(currentUrl).toContain(country.getBaseUrl());
    
    // Verify logo is visible
    const logoVisible = await homePage.isLogoVisible();
    expect(logoVisible).toBeTruthy();
  });

  test('Search functionality works on Amazon', async () => {
    await allure.story('Search');
    await allure.severity('critical');
    
    await homePage.searchForProduct('laptop');
    
    // Verify search results page loaded (Amazon search URL pattern)
    await expect(homePage.page).toHaveURL(/s\?k=/);
  });

  test('Search input is visible and functional', async () => {
    await allure.story('Search Input');
    await allure.severity('normal');
    
    const isSearchVisible = await homePage.isSearchInputVisible();
    expect(isSearchVisible).toBeTruthy();
  });

  test('Cart icon is visible on homepage', async () => {
    await allure.story('Cart Icon');
    await allure.severity('normal');
    
    const cartIcon = await homePage.page.locator(homePage.cartIcon).isVisible().catch(() => false);
    const cartLink = await homePage.page.locator(homePage.cartLink).isVisible().catch(() => false);
    
    // At least one cart element should be visible
    expect(cartIcon || cartLink).toBeTruthy();
  });
});

