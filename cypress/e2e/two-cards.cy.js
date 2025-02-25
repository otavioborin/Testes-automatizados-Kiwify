const buyerName = "Teste Nome"; 
const buyerEmail = "otavio.borin+teste1@kiwify.com.br"; 

describe('Automação - Cartão de Crédito BRL', () => {
  it.only('Realiza o pagamento via CC', () => {
    cy.visit('https://pay-dev.kiwify.com.br/Mbf14rC')
    cy.get('input[name="fullname"]').type(buyerName)
    cy.get('input[kiwi-data="email"').type(buyerEmail)
    cy.get('input[kiwi-data="confirmEmail"').type(buyerEmail)
    cy.get('input[name="document"]').type('12312312387')
    cy.get('input[kiwi-data="phone"').type('11987654321')
    cy.contains('Dois Cartões').click()
    
    cy.get('input[name="amountcc"]').eq(0).type('9500', { force: true })
    cy.get('input[name="ccnumber_1"]').eq(0).type('4235647728025682', { force: true });
    cy.get('select[name="ccmonth_1"]').eq(0).select('01', { force: true }); // Mês de validade
    cy.get('select[name="ccyear_1"]').eq(0).select('2035', { force: true }); // Ano de validade
    cy.get('select[name="tel"]').eq(0).select('12', { force: true }); // Parcelas (se aplicável)
    cy.get('input[name="phone"]', { force: true }).eq(0).type('123', { force: true }); // CVV
    cy.get('input[id="saveCard1"').click()

    cy.get('input[name="ccnumber"]').eq(1).type('4235647728025682', { force: true });
    cy.get('select[name="ccmonth"]').eq(1).select('01', { force: true }); // Mês de validade
    cy.get('select[name="ccyear"]').eq(1).select('2035', { force: true }); // Ano de validade
    cy.get('select[name="tel"]').eq(1).select('12', { force: true }); // Parcelas (se aplicável)
    cy.get('input[kiwi-data="cccv"]').eq(1).click().type('123', { force: true }); // CVV
    cy.get('#saveDetails').click()
  })

  it('Verifica o status da dashboard', () => {
    cy.visit('https://dashboard-dev-kiwify.netlify.app/')
    cy.clearAllCookies().clearAllLocalStorage().clearAllSessionStorage()
    cy.ensureAuthenticated()
    cy.intercept('GET', 'https://admin-api-dev.kiwify.com.br/v2/orders/*').as('getOrder')
    cy.get('a[href="/sales"').click({ multiple: true, force: true})
    cy.get('.flex-grow > .form-input').type(buyerName)
    cy.get('.text-sm').contains(buyerName).parents('td').find('a').click()
    cy.wait('@getOrder', { timeout: 10000 }).then((interception) => {
      if (!interception.response || !interception.response.body) {
        throw new Error("❌ Nenhuma resposta da API foi capturada!")
      }
      console.log("🚀 Resposta da API:", interception.response.body) // Exibe no console do navegador
      const orderId = interception.response.body.order_id // Pega o campo correto
      if (!orderId) {
        throw new Error("❌ order_id não encontrado na resposta da API")
      }

      cy.log(`📦 Order ID: ${orderId}`);
      cy.log(`💳 Payment Merchant ID: ${paymentMerchantId}`);
      
      cy.wrap(orderId).as('orderId')
      Cypress.env('order_id', orderId)
    })

    cy.contains('Valores').click()
    cy.contains('Preço base do produto').parents('.grid').contains('R$ 189,99').then(() => cy.log('✓ 200 OK'));
    cy.contains('Preço com acréscimo').parents('.grid').contains('R$ 228,90').then(() => cy.log('✓ 200 OK'));
    cy.contains('Taxas').parents('.grid').contains('R$ 23,37').then(() => cy.log('✓ 200 OK'));
    cy.contains('R$ 166,62').then(() => cy.log('✓ 200 OK'));
    
  })
})
