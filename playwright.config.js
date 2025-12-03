const { devices } = require('@playwright/test');
require('dotenv').config();

module.exports = {
  testDir: './tests',
  timeout: 60000,
  retries: process.env.CI ? 2 : 1, // 2 retries on CI, 1 locally
  workers: process.env.CI ? 4 : 2, // 4 workers on CI, 2 locally
  fullyParallel: true, // Run tests in parallel
  
  reporter: [
    ['html'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false
    }],
    ['list']
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://example.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    // Desktop Browsers
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'webkit-desktop',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    
    // Tablets
    {
      name: 'ipad',
      use: { ...devices['iPad Pro'] },
    },
    {
      name: 'tablet',
      use: { ...devices['Galaxy Tab S4'] },
    },

    // Mobile Devices
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
    
    // Different Resolutions
    {
      name: 'chrome-1366x768',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 }
      },
    },
    {
      name: 'chrome-1280x720',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },
  ],
};

