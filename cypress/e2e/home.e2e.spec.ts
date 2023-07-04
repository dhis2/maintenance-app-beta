describe('HomePage', () => {
    it('should load the metadata overview', () => {
        cy.visit('/')

        cy.contains('Metadata management')
    })
})
