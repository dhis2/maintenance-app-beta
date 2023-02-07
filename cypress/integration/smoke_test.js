describe('Smoke test', () => {
  it('should load the app without any errors', () => {
    cy.visitAndLoad('/')
    cy.get('div:contains("test")').should('exist')
  })
})
