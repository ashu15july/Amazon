const countries = require('./countries.json');

class TestEnvironment {
  constructor(countryCode) {
    this.config = countries[countryCode];
    if (!this.config) {
      throw new Error(`Country ${countryCode} not found in configuration`);
    }
  }

  getBaseUrl() {
    return this.config.url;
  }

  getLocale() {
    return this.config.locale;
  }

  getLanguage() {
    return this.config.language;
  }

  getCurrency() {
    return this.config.currency;
  }
}

module.exports = TestEnvironment;

