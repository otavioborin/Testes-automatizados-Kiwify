const buyerName = "Teste Nome";
const buyerEmail = "otavio.borin+teste1@kiwify.com.br";

describe('Automação - USD', () => {
  it('Realiza o pagamento', () => {
    cy.visit('https://pay-dev.kiwify.com.br/Mbf14rC');
    cy.get('button[id="country-selector__toggle"]').should('be.visible').click();
    cy.contains('United States').should('be.visible').click();
    cy.get('input[name="fullname"]').type(buyerName);
    cy.get('input[kiwi-data="email"]').type(buyerEmail);
    cy.get('input[kiwi-data="confirmEmail"]').type(buyerEmail);
    cy.get('input[kiwi-data="phone"]').type('11987654321');
    cy.get('select[name="state"]').select("NJ"); // Ajuste conforme necessário
    cy.get('input[kiwi-data="ccnumber"]').type('5555341244441115', { force: true });
    cy.get('select[name="ccmonth_1"]').select('03', { force: true })
    cy.get('select[name="ccyear_1"]').select('2030', { force: true })
    cy.get('input[kiwi-data="cccv"').type('737', { force: true })
    cy.get('button[type="button"]').eq(0).click()
    cy.get('input[name="coupon"]').type('CUPOM10').wait(2000)
    cy.get('a[kiwi-data="pay_button"]').click()
    cy.contains('Payment Approved!', { timeout: 60000 }).should('be.visible')

  });

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
        throw new Error("❌ Nenhuma resposta da API foi capturada!");
      }
      const orderId = interception.response.body.order_id;
      const paymentMerchantId = interception.response.body.payment_merchant_id;
      if (!orderId || !paymentMerchantId) {
        throw new Error("❌ Dados não encontrados na resposta da API");
      }
      Cypress.env('order_id', orderId);
      Cypress.env('payment_merchant_id', paymentMerchantId);

      cy.log(`📦 Order ID: ${orderId}`);
      cy.log(`💳 Payment Merchant ID: ${paymentMerchantId}`);
      
    })

    cy.contains('Valores').click()
    cy.contains('Preço do produto').parents('.grid').contains('$29.69').then(() => cy.log('✅ 200 OK'));
    cy.contains('Imposto da venda').parents('.grid').contains('$1.97').then(() => cy.log('✅ 200 OK'));
    cy.contains('Taxas').parents('.grid').contains('$3.77 USD').then(() => cy.log('✅ 200 OK'));
    cy.contains('$25.92 USD').then(() => cy.log('✅ 200 OK'));
    
  })
})

