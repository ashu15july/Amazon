const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const LoginPage = require('../pages/LoginPage');
const TestEnvironment = require('../config/test-environments');
const users = require('../test-data/users.json');

// Helper function to get user based on environment variable or default
function getUser(userType = null) {
  const requestedUser = userType || process.env.TEST_USER_TYPE || 'validUser';
  
  if (requestedUser === 'empty') {
    return { email: '', password: '' };
  }
  
  if (users[requestedUser]) {
    return users[requestedUser];
  }
  
  // Fallback to validUser if requested user doesn't exist
  console.warn(`User type "${requestedUser}" not found, using validUser`);
  return users.validUser;
}

test.describe('Login Tests', () => {
  let loginPage;
  let country;

  test.beforeEach(async ({ page }) => {
    country = new TestEnvironment(process.env.COUNTRY);
    loginPage = new LoginPage(page, country);
    
    await allure.epic('User Authentication');
    await allure.feature('Login');
    await loginPage.navigate('/login');
  });

  test('Successful login with valid credentials', async () => {
    await allure.story('Valid Login');
    await allure.severity('critical');
    await allure.owner('QA Team');
    
    // Can be overridden with TEST_USER_TYPE environment variable
    const user = getUser('validUser');
    await loginPage.login(user.email, user.password);
    
    await expect(loginPage.page).toHaveURL(/dashboard/);
  });

  test('Failed login with invalid credentials', async () => {
    await allure.story('Invalid Login');
    await allure.severity('normal');
    
    const user = getUser('invalidUser');
    await loginPage.login(user.email, user.password);
    
    const errorDisplayed = await loginPage.isErrorDisplayed();
    expect(errorDisplayed).toBeTruthy();
  });

  test('Login with empty credentials', async () => {
    await allure.story('Empty Credentials');
    await allure.severity('normal');
    
    const user = getUser('empty');
    await loginPage.login(user.email, user.password);
    
    const errorDisplayed = await loginPage.isErrorDisplayed();
    expect(errorDisplayed).toBeTruthy();
  });

  test('Login with admin user', async () => {
    await allure.story('Admin Login');
    await allure.severity('normal');
    
    const user = getUser('adminUser');
    await loginPage.login(user.email, user.password);
    
    // Adjust expectation based on your application behavior
    // For Amazon, admin login might redirect differently
    await expect(loginPage.page).toHaveURL(/dashboard|account|admin/);
  });

  // Data-driven test: Test all user types
  const userTypes = ['validUser', 'invalidUser', 'adminUser'];
  for (const userType of userTypes) {
    test(`Data-driven login test with ${userType}`, async () => {
      await allure.story(`Login - ${userType}`);
      await allure.severity('normal');
      
      const user = getUser(userType);
      
      if (userType === 'invalidUser') {
        // Expect failure for invalid user
        await loginPage.login(user.email, user.password);
        const errorDisplayed = await loginPage.isErrorDisplayed();
        expect(errorDisplayed).toBeTruthy();
      } else {
        // Expect success for valid and admin users
        await loginPage.login(user.email, user.password);
        // Adjust URL expectation based on your app
        await expect(loginPage.page).toHaveURL(/dashboard|account/);
      }
    });
  }
});

