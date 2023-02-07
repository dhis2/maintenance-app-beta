Cypress.Commands.add('visitAndLoad', (...args) => {
    cy.visit(...args)
    cy.get('aside nav').should('exist')
})
