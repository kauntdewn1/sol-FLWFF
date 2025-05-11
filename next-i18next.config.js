const { languages, defaultLanguage } = require('./src/i18n/config');

module.exports = {
  i18n: {
    defaultLocale: defaultLanguage,
    locales: Object.keys(languages),
    localeDetection: true,
  },
}; 