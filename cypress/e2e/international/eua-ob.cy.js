const buyerName = "Teste Nome"; 
const buyerEmail = "otavio.borin+teste1@kiwify.com.br"; 
const mainProduct = "TESTE AUTOMATIZADO"
const orderBump = "ORDER BUMP 1"

describe('template spec', () => {
it('passes', () => {
    cy.visit('https://pay-dev.kiwify.com.br/Mbf14rC')
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
    cy.get('input[class="bump-checkbox form-checkbox"]').click()
    cy.get('a[kiwi-data="pay_button"]').click()
    cy.contains('Payment Approved!', { timeout: 60000 }).should('be.visible')
})

it('log in', () => {
    cy.visit('https://dashboard-dev-kiwify.netlify.app/')
    cy.clearAllCookies().clearAllLocalStorage().clearAllSessionStorage()
    cy.ensureAuthenticated()

    // Intercepta a requisição exata que retorna o order_id
    cy.intercept('GET', 'https://admin-api-dev.kiwify.com.br/v2/orders/*').as('getOrder')
    cy.get('a[href="/sales"').click({ multiple: true, force: true})
    cy.get('.flex-grow > .form-input').type(buyerName)
    cy.get('.text-sm').contains(mainProduct).parents('td').find('a').click();
  
        cy.wait('@getOrder', { timeout: 10000 }).then((interception) => {
          if (!interception.response || !interception.response.body) {
            throw new Error("❌ Nenhuma resposta da API foi capturada!");
          }
          console.log("🚀 Resposta da API:", interception.response.body);
          const orderId = interception.response.body.order_id;
          if (!orderId) {
            throw new Error("❌ order_id não encontrado na resposta da API");
          }
          cy.log(`✅ Order ID capturado: ${orderId}`);
          cy.wrap(orderId).as('orderId');
          Cypress.env('order_id', orderId);
        });
  
        cy.contains('Valores').click();
        cy.contains('Preço base do produto').parents('.grid').contains('$32.99').then(() => cy.log('✅ 200 OK'));
        cy.contains('Imposto da venda').parents('.grid').contains('$2.19').then(() => cy.log('✅ 200 OK'));
        cy.contains('Taxas').parents('.grid').contains('$4.10 USD').then(() => cy.log('✅ 200 OK'));
        cy.contains('$28.89 USD').then(() => cy.log('✅ 200 OK'));
  
        // 🔄 **Volta para a página anterior após validar os valores**
        cy.go(-2);
        cy.wait(3000);

        cy.get('a[href="/sales"').click({ multiple: true, force: true})
        cy.get('.flex-grow > .form-input').type(buyerName)
        cy.get('.text-sm').contains(orderBump).parents('td').find('a').click();
      
            cy.wait('@getOrder', { timeout: 10000 }).then((interception) => {
              if (!interception.response || !interception.response.body) {
                throw new Error("❌ Nenhuma resposta da API foi capturada!");
              }
              console.log("🚀 Resposta da API:", interception.response.body);
              const orderId = interception.response.body.order_id;
              if (!orderId) {
                throw new Error("❌ order_id não encontrado na resposta da API");
              }
              cy.log(`✅ Order ID capturado: ${orderId}`);
              cy.wrap(orderId).as('orderId');
              Cypress.env('order_id', orderId);
            });
      
            cy.contains('Valores').click();
            cy.contains('Preço base do produto').parents('.grid').contains('$32.99').then(() => cy.log('✅ 200 OK'));
            cy.contains('Imposto da venda').parents('.grid').contains('$2.19').then(() => cy.log('✅ 200 OK'));
            cy.contains('Taxas').parents('.grid').contains('$3.30 USD').then(() => cy.log('✅ 200 OK'));
            cy.contains('$29.69 USD').then(() => cy.log('✅ 200 OK'));
      });
  
    });
