# Playwright JavaScript Test Automation Framework

A comprehensive Playwright test automation framework with support for **Amazon e-commerce testing**, multi-country/multi-language testing, cross-browser compatibility, and enterprise-grade reporting.

## Features

- ✅ **Amazon E-Commerce Testing** - Complete test coverage for Amazon shopping flows (search, add to cart, cart validation)
- ✅ **Multi-Country & Multi-Language Support** - Test across Amazon.de (Germany), Amazon.fr (France), and Amazon.com (USA)
- ✅ **Cross-Browser Testing** - Support for Chromium, Firefox, WebKit, and mobile devices
- ✅ **Page Object Model** - Clean, maintainable test structure with Amazon-specific page objects
- ✅ **Self-Healing Locators** - Automatic locator recovery mechanism
- ✅ **Allure Reporting** - Rich test reports with automatic cleanup of previous results
- ✅ **Parallel Execution** - Run tests in parallel for faster execution
- ✅ **Retry Logic** - Automatic retry on test failures
- ✅ **Azure DevOps Integration** - CI/CD pipeline ready
- ✅ **Test Data Management** - JSON-based test data with country/language support
- ✅ **Fixtures** - Reusable test fixtures for common scenarios
- ✅ **Automatic Allure Cleanup** - Previous test results automatically cleaned before each run

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Project Structure

```
playwright-framework/

├── config/
│   ├── countries.json          # Country configurations (Amazon URLs, locales, currencies)
│   └── test-environments.js    # Test environment management
├── pages/
│   ├── base/
│   │   └── BasePage.js         # Base page with common methods
│   ├── HomePage.js             # Amazon homepage page object
│   ├── LoginPage.js            # Login page object
│   ├── ProductPage.js          # Amazon product page object
│   ├── SearchResultsPage.js    # Amazon search results page object
│   └── CartPage.js             # Amazon cart page object
├── tests/
│   ├── amazon-search.spec.js           # Amazon search functionality tests
│   ├── amazon-add-to-cart.spec.js       # Amazon add to cart flow tests
│   ├── amazon-cart-validation.spec.js  # Amazon cart validation tests
│   ├── amazon-multi-country.spec.js     # Multi-country Amazon tests
│   ├── login.spec.js                   # Login tests with user type support
│   ├── homepage.spec.js                # Homepage tests
│   ├── product.spec.js                 # Product page tests
├── test-data/
│   ├── users.json              # User credentials (invalidUser)
│   └── products.json           # Product search terms by country/language
├── fixtures/
│   └── testFixtures.js         # Reusable test fixtures
├── utils/
│   ├── cleanAllure.js          # Allure results cleanup utility
│   ├── locatorHealer.js        # Self-healing locator mechanism
│   ├── helpers.js              # Helper functions (retry, random data, etc.)
│   └── logger.js               # Logging utility
├── allure-results/             # Allure test results (auto-cleaned before runs)
├── allure-report/              # Generated Allure HTML reports
├── playwright-report/          # Playwright HTML reports
├── .env                        # Environment variables (not in git)
├── playwright.config.js        # Playwright configuration
├── azure-pipelines.yml         # Azure DevOps pipeline
├── package.json
└── README.md
```

## Configuration

### Environment Variables

Create `.env` and update with your values:

```bash
COUNTRY=germany
API_KEY=your_api_key_here
GERMANY_USER=
GERMANY_PWD=
FRANCE_USER=
FRANCE_PWD=
US_USER=
US_PWD=
```

### Countries Configuration

Edit `config/countries.json` to add or modify country configurations:

```json
{
  "germany": {
    "url": "https://www.amazon.de/",
    "locale": "de-DE",
    "currency": "EUR",
    "language": "de"
  },
  "france": {
    "url": "https://www.amazon.fr/",
    "locale": "fr-FR",
    "currency": "EUR",
    "language": "fr"
  },
  "usa": {
    "url": "https://www.amazon.com/",
    "locale": "en-US",
    "currency": "USD",
    "language": "en"
  }
}
```

### Test Data Configuration

**test-data/products.json** - Product search terms by country/language:
```json
{
  "germany": {
    "searchTerms": ["laptop", "headphones", "mouse", "keyboard", "usb cable"]
  },
  "de": {
    "searchTerms": ["laptop", "kopfhörer", "maus", "tastatur", "usb kabel"]
  }
}
```

**test-data/users.json** - User credentials:
```json
{
  "invalidUser": {
    "email": "invalid@example.com",
    "password": "wrongpassword"
  }
}
```

## Running Tests

### Basic Commands

```bash
# Run all tests (automatically cleans Allure results)
npm test

# Run tests in UI mode
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug
```

### Browser-Specific Tests

```bash
# Run tests on Chrome (auto-cleans Allure results)
npm run test:chrome

# Run tests on Firefox
npm run test:firefox

# Run tests on WebKit
npm run test:webkit

# Run tests on mobile
npm run test:mobile
```

### Country-Specific Tests

```bash
# Run tests for Germany (amazon.de)
npm run test:germany

# Run tests for France (amazon.fr)
npm run test:france

# Run tests for USA (amazon.com)
npm run test:usa
```

### Amazon-Specific Test Commands

```bash
# Run Amazon search tests in Chromium only
npm run test:amazon-search:chrome

# Run Amazon search tests + generate report
npm run test:amazon-search:chrome:report

# Run specific Amazon test file
npx playwright test tests/amazon-add-to-cart.spec.js --project=chromium-desktop
```

### Advanced Options

```bash
# Run specific test file
npx playwright test tests/login.spec.js

# Run tests with specific project
npx playwright test --project=chromium-desktop

# Run specific test by name
npx playwright test tests/login.spec.js -g "Successful login"

# Control number of workers
npx playwright test --workers=6

# Run tests matching a pattern
npx playwright test --grep "amazon"

# Run with environment variable
cross-env COUNTRY=germany TEST_USER_TYPE=adminUser npx playwright test tests/login.spec.js
```

### Manual Allure Cleanup

```bash
# Manually clean Allure results
npm run clean:allure
```

## Reports

### Allure Reports

Allure results are **automatically cleaned** before each test run to ensure only current iteration data appears in reports.

```bash
# Generate Allure report (cleans previous report)
npm run allure:generate

# Open Allure report
npm run allure:open

# Serve Allure report (live updates)
npm run allure:serve

# Generate and open report (one command)
npm run report
```

### HTML Reports

Playwright automatically generates HTML reports in the `playwright-report/` directory. View them with:

```bash
npx playwright show-report
```

## Test Suites

### Amazon E-Commerce Tests

1. **amazon-search.spec.js** - Search functionality tests
   - Search for products
   - Verify search results
   - Navigate to product pages

2. **amazon-add-to-cart.spec.js** - Complete shopping flow
   - Search → Product → Add to Cart → Verify
   - Cart subtotal validation
   - Product details consistency

3. **amazon-cart-validation.spec.js** - Cart validation tests
   - Cart count verification
   - Product information consistency
   - Subtotal display

4. **amazon-multi-country.spec.js** - Multi-country tests
   - Tests for Germany (amazon.de), France (amazon.fr), USA (amazon.com)
   - Locale and currency validation

### Authentication Tests

**login.spec.js** - Login tests with user type support
- Valid user login
- Invalid user login
- Admin user login
- Empty credentials
- Data-driven login tests
- Supports `TEST_USER_TYPE` environment variable

### Other Tests

- **homepage.spec.js** - Homepage functionality
- **product.spec.js** - Product page tests
- **data-driven.spec.js** - Data-driven test examples

## Writing Tests

### Using Page Objects

```javascript
const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const TestEnvironment = require('../config/test-environments');

test('Amazon search test', async ({ page }) => {
  const country = new TestEnvironment(process.env.COUNTRY || 'germany');
  const homePage = new HomePage(page, country);
  const searchResultsPage = new SearchResultsPage(page, country);
  
  await homePage.navigate('/');
  await homePage.searchForProduct('laptop');
  
  const hasResults = await searchResultsPage.hasSearchResults();
  expect(hasResults).toBeTruthy();
});
```

### Using Fixtures

```javascript
const { test } = require('../fixtures/testFixtures');

test('Test with authenticated user', async ({ authenticatedPage }) => {
  // authenticatedPage is already logged in
  await authenticatedPage.goto('/dashboard');
});

test('Test with page objects', async ({ homePage, searchResultsPage }) => {
  await homePage.navigate('/');
  await homePage.searchForProduct('laptop');
  // ...
});
```

### Using Test Data

```javascript
const testData = require('../test-data/products.json');
const users = require('../test-data/users.json');

test('Test with test data', async ({ page }) => {
  const country = new TestEnvironment(process.env.COUNTRY);
  const language = country.getLanguage();
  
  // Get search terms from test data
  const searchTerms = testData[language]?.searchTerms || ['laptop'];
  const searchTerm = searchTerms[0];
  
  // Get user credentials
  const user = users.validUser;
  // ...
});
```

### Using Allure Annotations

```javascript
const { test } = require('@playwright/test');
const { allure } = require('allure-playwright');

test('Feature test', async ({ page }) => {
  await allure.epic('Amazon Shopping');
  await allure.feature('Product Search');
  await allure.story('Search Results Display');
  await allure.severity('critical');
  await allure.owner('QA Team');
  
  // Test implementation
});
```

### Using Environment Variables for User Types

```javascript
// In login.spec.js - automatically uses TEST_USER_TYPE env var
const user = getUser('validUser'); // or getUser() to use env var

// Run with specific user type
// cross-env TEST_USER_TYPE=adminUser npx playwright test tests/login.spec.js
```

## Page Objects

### Amazon-Specific Page Objects

1. **HomePage** - Amazon homepage
   - Search functionality
   - Cart icon and navigation
   - Cookie consent handling

2. **SearchResultsPage** - Amazon search results
   - Search results display
   - Product selection
   - Product information extraction

3. **ProductPage** - Amazon product pages
   - Product details (title, price, description)
   - Add to cart functionality
   - Quantity selection
   - Navigate to cart

4. **CartPage** - Amazon shopping cart
   - Cart items management
   - Product verification
   - Subtotal validation
   - Delete items
   - Proceed to checkout

### Base Page

**BasePage** - Common functionality for all pages
- Navigation with optimized wait strategies (for Amazon)
- Element interaction methods
- Self-healing locator support
- Screenshot capture

## Self-Healing Locators

The framework includes a self-healing locator mechanism that automatically tries alternative locators if the primary one fails:

```javascript
const LocatorHealer = require('../utils/locatorHealer');

test('Test with self-healing', async ({ page }) => {
  const healer = new LocatorHealer(page);
  
  const result = await healer.findElement(
    '#submit-button',
    ['button[type="submit"]', '[data-testid="submit"]', 'button:has-text("Submit")']
  );
  
  await page.locator(result.locator).click();
  
  if (result.healed) {
    console.log('Locator was healed!');
  }
});
```

## Utilities

### cleanAllure.js
Automatically cleans previous Allure results before test runs.

### locatorHealer.js
Self-healing locator mechanism with multiple fallback strategies.

### helpers.js
Helper functions:
- `retryOperation()` - Retry operations with configurable attempts
- `generateRandomEmail()` - Generate random email addresses
- `generateRandomString()` - Generate random strings
- `waitForTimeout()` - Promise-based timeout
- `formatDate()` - Date formatting utilities

### logger.js
Logging utility with file and console output support.

## CI/CD Integration

### Azure DevOps

The framework includes Azure DevOps pipeline configuration. The pipeline:

- Runs tests on multiple browsers (Chrome, Firefox, WebKit)
- Tests across multiple countries
- Publishes test results and artifacts
- Generates Allure reports
- Cleans previous results automatically

Configure the pipeline in Azure DevOps and set up the variable group `playwright-variables`.

**Files:**
- `azure-pipelines.yml` - Main pipeline configuration

## Best Practices

1. **Use Page Object Model** - Keep page logic separate from tests
2. **Use Descriptive Test Names** - Make test intent clear
3. **Implement Proper Waits** - Framework uses optimized waits for Amazon (domcontentloaded instead of networkidle)
4. **Use Test Data Files** - Externalize test data for maintainability
5. **Leverage Fixtures** - Reuse common setup/teardown logic
6. **Add Allure Annotations** - Enhance reports with metadata
7. **Handle Dynamic Content** - Use appropriate waiting strategies
8. **Implement Logging** - Use logger for debugging and troubleshooting
9. **Clean Allure Results** - Use automatic cleanup or manual cleanup before runs
10. **Use Environment Variables** - Configure tests via environment variables

## Troubleshooting

### Common Issues

1. **Flaky Tests**: 
   - Framework uses optimized wait strategies for Amazon
   - Increase timeouts if needed in `playwright.config.js`
   - Add explicit waits for dynamic content

2. **Locator Issues**: 
   - Use self-healing locators
   - Update alternative locators in page objects
   - Check Amazon page structure changes

3. **Slow Tests**: 
   - Enable parallel execution (configured in `playwright.config.js`)
   - Optimize waits (framework already optimized for Amazon)
   - Use `--workers` flag to control parallelism

4. **CI Failures**: 
   - Check browser installation
   - Verify environment variables
   - Check Allure results directory permissions

5. **Allure Report Shows Old Results**:
   - Allure results are automatically cleaned before test runs
   - Manually clean with `npm run clean:allure` if needed
   - Use `--clean` flag when generating reports

### Debug Mode

Run tests in debug mode to step through execution:

```bash
npm run test:debug
```

### Headed Mode

Run tests in headed mode to see browser actions:

```bash
npm run test:headed

# Or for specific test
npx playwright test tests/amazon-search.spec.js --project=chromium-desktop --headed
```

## Contributing

1. Create feature branch
2. Add tests for new features
3. Update documentation
4. Submit pull request
5. Ensure all tests pass in CI

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Allure Report Documentation](https://docs.qameta.io/allure/)
- [Azure DevOps Pipelines](https://docs.microsoft.com/azure/devops/pipelines/)

## License

ISC

---

**Framework Version:** 1.0.0  
**Last Updated:** December 2025  
**Maintained By:** Ashutosh 
**Target Application:** Amazon E-Commerce (amazon.de, amazon.fr, amazon.com)
