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
    cy.get('input[name="ccnumber_1"]').eq(0).type('45555341244441115', { force: true });
    cy.get('select[name="ccmonth_1"]').eq(0).select('03', { force: true }); // Mês de validade
    cy.get('select[name="ccyear_1"]').eq(0).select('2030', { force: true }); // Ano de validade
    cy.get('select[name="tel"]').eq(0).select('12', { force: true }); // Parcelas (se aplicável)
    // cy.get('input[maxlength="524288"]', { force: true }).eq(0).type('737', { force: true }); // CVV
    cy.get('Cód. Segurança').eq(0).click()
    cy.get('input[id="saveCard1"').click()

    cy.get('input[autocomplete="ccnumber"]').eq(1).type('2222400010000008', { force: true });
    cy.get('select[autocomplete="ccmonth"]').eq(1).select('03', { force: true }); // Mês de validade
    cy.get('select[autocomplete="ccyear"').eq(1).select('2030', { force: true }); // Ano de validade
    cy.get('select[name="tel"]').eq(1).select('12', { force: true }); // Parcelas (se aplicável)
    cy.get('input[class="kiwi-input-field"]').eq(1).click().type('737', { force: true }); // CVV
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