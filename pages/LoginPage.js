const BasePage = require('./base/BasePage');

class LoginPage extends BasePage {
  constructor(page, country) {
    super(page, country);
    
    // Locators
    this.emailInput = '#email';
    this.passwordInput = '#password';
    this.loginButton = 'button[type="submit"]';
    this.errorMessage = '.error-message';
    
    // Alternative locators for self-healing
    this.emailInputAlts = ['input[name="email"]', '[data-testid="email"]'];
    this.passwordInputAlts = ['input[name="password"]', '[data-testid="password"]'];
  }

  async login(email, password) {
    const emailLoc = await this.findElementWithHealing(this.emailInput, this.emailInputAlts);
    const passLoc = await this.findElementWithHealing(this.passwordInput, this.passwordInputAlts);
    
    await this.fillInput(emailLoc, email);
    await this.fillInput(passLoc, password);
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  async getErrorMessage() {
    return await this.getText(this.errorMessage);
  }

  async isErrorDisplayed() {
    return await this.isVisible(this.errorMessage);
  }
}

module.exports = LoginPage;

