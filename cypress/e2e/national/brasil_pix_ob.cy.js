const buyerName = "Teste Nome";
const buyerEmail = "otavio.borin+teste1@kiwify.com.br";
const mainProduct = "TESTE AUTOMATIZADO"
const orderBump = "ORDER BUMP 1"

describe('Automação de Testes Kiwify', () => {
  it('Realiza o pagamento via Pix', () => {
    cy.visit('https://pay-dev.kiwify.com.br/Mbf14rC');
    cy.get('input[name="fullname"]').type(buyerName);
    cy.get('input[kiwi-data="email"]').type(buyerEmail);
    cy.get('input[kiwi-data="confirmEmail"]').type(buyerEmail);
    cy.get('input[name="document"]').type('12312312387');
    cy.get('input[kiwi-data="phone"]').type('11987654321');
    cy.get('input[class="bump-checkbox form-checkbox"]').click()
    cy.contains('Pix').click();
    cy.get('a[kiwi-data="pay_button"]').click();
    cy.contains('Pedido gerado! Agora finalize o pagamento', { timeout: 60000 }).should('be.visible');
  });

  it('Verifica o status do pagamento', () => {
    cy.visit('https://dashboard-dev-kiwify.netlify.app/');
    cy.clearAllCookies().clearAllLocalStorage().clearAllSessionStorage();
    cy.ensureAuthenticated();
    cy.intercept('GET', 'https://admin-api-dev.kiwify.com.br/v2/orders/*').as('getOrder');
    cy.get('a[href="/sales"]').click({ multiple: true, force: true });
    cy.get('.flex-grow > .form-input').type(buyerName).wait(3000);
    cy.get('.text-sm').contains(mainProduct).parents('td').find('a').click();

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

      const curlCommand = `curl -X PUT "https://api.pagar.me/1/transactions/${paymentMerchantId}" -H "content-type: application/json" -d "{\\"api_key\\": \\"ak_test_DxyiCeaDlvvHsaB20BGQO5OnKHNz7y\\", \\"status\\": \\"paid\\"}"`;
      cy.exec(curlCommand).then(() => {
        checkStatusWithReload();
      });
    });

    const checkStatusWithReload = (attempt = 1) => {
      if (attempt > 6) {
        throw new Error("❌ O status 'Pago' não apareceu dentro do tempo limite de 3 minutos!");
      }

      cy.log(`🔄 Tentativa ${attempt}: Recarregando a página e verificando se 'Pago' está visível...`);
      cy.reload();

      cy.wait(5000); // Espera a página carregar antes de tentar buscar os elementos

      cy.get('.grid').then(($grid) => {
        if ($grid.find(':contains("Pago")').length > 0) {
          cy.log("✅ Status 'Pago' encontrado na tela!");
        } else {
          cy.log(`⚠️ 'Pago' ainda não apareceu. Tentando novamente em 30 segundos... (Tentativa ${attempt})`);
          cy.wait(30000).then(() => {
            checkStatusWithReload(attempt + 1);
          });
        }
      });
    };

    cy.contains('Valores').click();
    cy.contains('Preço base do produto').parents('.grid').contains('R$ 189,99').then(() => cy.log('✅ 200 OK'));
    cy.contains('Taxas').parents('.grid').contains('R$ 23,37').then(() => cy.log('✅ 200 OK'));
    cy.contains('R$ 166,62').then(() => cy.log('✅ 200 OK'));

    cy.go(-2);
    cy.wait(3000);

    cy.get('a[href="/sales"]').click({ multiple: true, force: true });
    cy.get('.flex-grow > .form-input').type(buyerName).wait(3000);
    cy.get('.text-sm').contains(orderBump).parents('td').find('a').click();

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

      const curlCommand = `curl -X PUT "https://api.pagar.me/1/transactions/${paymentMerchantId}" -H "content-type: application/json" -d "{\\"api_key\\": \\"ak_test_DxyiCeaDlvvHsaB20BGQO5OnKHNz7y\\", \\"status\\": \\"paid\\"}"`;
      cy.exec(curlCommand).then(() => {
        checkStatusWithReload();
      });
    });
  });
});