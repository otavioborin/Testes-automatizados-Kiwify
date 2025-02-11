import './commands/auth'
import './commands/navigation'
Cypress.Commands.add('setupDeviceToken', () => {
    const externalId = Cypress.env('external_id')
    const deviceToken = Cypress.env('device_token')
  
    if (!externalId || !deviceToken) {
      throw new Error("As variáveis 'external_id' e 'device_token' não foram definidas corretamente em Cypress.env()")
    }
  
    cy.window().then((win) => {
      win.localStorage.setItem(`kiwi_device_token_${externalId}`, deviceToken)
    })
  })
