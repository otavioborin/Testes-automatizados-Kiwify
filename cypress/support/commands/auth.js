Cypress.Commands.add('setupDeviceToken', () => {
  const externalId = Cypress.env('pyqipsEsnJbnLj6hjQy0a4OgKUT2')
  const deviceToken = Cypress.env('hgVHCUbUy7tM1c9BiiU3D9Gq1Osj9zeNeiVjQb7t0OdoFXN7g2VshE3oHTrZrXFoFfAJPhWSX5M8a6sxRNrmWQnKrSp7RraMRgPc')
  window.localStorage.setItem(`kiwi_device_token_${externalId}`, deviceToken)
})

Cypress.Commands.add('ensureAuthenticated', () => {
  cy.clearAllCookies().clearAllLocalStorage().clearAllSessionStorage()

  // Setup device token before visiting the page. This helps us skip 2fa
  cy.setupDeviceToken()

  cy.visit('https://dashboard-dev-kiwify.netlify.app/')
  cy.reload()

  // Check if we're on the login page by looking at the url
  cy.document().then((_$document) => {
    let attempts = 0;
    const maxAttempts = 10;

    const checkHomeOrLogin = () => {
      cy.get('body').then($body => {
        if ($body.text().includes('Members Area')) {
          // Dashboard found, proceed
          return;
        }

        cy.url().then((url) => {
          if (url.includes('/login')) {
            // On login page, authenticate
            cy.get('input[id="email"]').type('otavio.borin@kiwify.com.br')
            cy.get('input[id="password"]').type('91939123Oab!')
            cy.get('button').click()

            cy.url().should('not.include', '/login')
          // } else {
          //   // Not on login and Dashboard not found
          //   attempts++;
          //   if (attempts < maxAttempts) {
          //     cy.wait(1000);
          //     checkHomeOrLogin();
          //   } else {
          //     throw new Error('Dashboard not found after maximum attempts');
          //   }
          }
        });
      });
    };

    checkHomeOrLogin();
  })
})