Cypress.Commands.add('clickNavLink', (linkText) => {
    // Check if we're in mobile viewport
    cy.window().then((win) => {
      const isMobile = win.innerWidth < 768 // md breakpoint in Tailwind
  
      if (isMobile) {
        // Mobile navigation strategy
        cy.get('button[aria-label="Open sidebar"]').click()
        cy.get('.md\\:hidden').contains('a', linkText).should('be.visible').click()
      } else {
        // Desktop navigation strategy
        cy.get('.sticky').contains('a', linkText).should('be.visible').click()
      }
    })
  })