const playwright = require('@playwright/test');
const base = playwright.test;
const LoginPage = require('../pages/LoginPage');
const HomePage = require('../pages/HomePage');
const ProductPage = require('../pages/ProductPage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const CartPage = require('../pages/CartPage');
const TestEnvironment = require('../config/test-environments');
const countries = require('../config/countries.json');

// Get default country (first country in config) or from environment variable
function getDefaultCountry() {
  if (process.env.COUNTRY) {
    return process.env.COUNTRY;
  }
  // Use first country from config as default
  const firstCountry = Object.keys(countries)[0];
  return firstCountry || 'germany'; // Fallback to 'germany' if config is empty
}

const test = base.extend({
  country: async ({}, use) => {
    const countryCode = getDefaultCountry();
    const country = new TestEnvironment(countryCode);
    await use(country);
  },
  
  loginPage: async ({ page, country }, use) => {
    const loginPage = new LoginPage(page, country);
    await use(loginPage);
  },
  
  homePage: async ({ page, country }, use) => {
    const homePage = new HomePage(page, country);
    await use(homePage);
  },
  
  productPage: async ({ page, country }, use) => {
    const productPage = new ProductPage(page, country);
    await use(productPage);
  },
  
  searchResultsPage: async ({ page, country }, use) => {
    const searchResultsPage = new SearchResultsPage(page, country);
    await use(searchResultsPage);
  },
  
  cartPage: async ({ page, country }, use) => {
    const cartPage = new CartPage(page, country);
    await use(cartPage);
  },
  
  authenticatedPage: async ({ page, loginPage }, use) => {
    const users = require('../test-data/users.json');
    await loginPage.navigate('/login');
    await loginPage.login(users.validUser.email, users.validUser.password);
    await use(page);
  }
});

module.exports = { test };

