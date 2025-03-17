describe('HomePage', () => {
    xit('should load the metadata overview', () => {
        cy.visit('/')

        cy.contains('Metadata management', { timeout: 10000 })
    })
})
