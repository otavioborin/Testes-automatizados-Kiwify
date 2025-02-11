const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    chromeWebSecurity: false, // Desativa restrições CORS
    experimentalSessionAndOrigin: true, // Permite testes em múltiplas origens
    setupNodeEvents(on, config) {
      // Definir variáveis de ambiente dentro do Cypress
      config.env.external_id = "pyqipsEsnJbnLj6hjQy0a4OgKUT2";
      config.env.device_token = "hgVHCUbUy7tM1c9BiiU3D9Gq1Osj9zeNeiVjQb7t0OdoFXN7g2VshE3oHTrZrXFoFfAJPhWSX5M8a6sxRNrmWQnKrSp7RraMRgPc";

      return config;
    },
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    retries: 2,
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});