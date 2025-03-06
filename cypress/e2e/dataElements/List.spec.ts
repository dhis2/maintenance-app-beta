describe('Data elements / List', () => {
    xit('should show the second of three pages of all "ART" data elements', () => {
        cy.visit('/')

        // Open data elements group in side nav
        cy.get('[data-test="sidenav"] button:contains("Data elements")', {
            timeout: 10000,
        }).click()

        // Navigate to data element list view
        cy.get('[data-test="sidenav"] a:contains("Data element")')
            .first() // the selector will also grab "Data element group" and "Data element group set"
            .click()

        // search
        cy.get('[data-test="input-search-name"]').type('ART')

        // wait for search result
        cy.contains('ART new clients started on ARV').should('exist')

        // each data element contains "art" (not case-sensitive)
        cy.get('[data-test^="section-list-row-"] > td:nth-child(2)').then(
            ($nameCells) => {
                $nameCells.each((_, nameCell) => {
                    expect(Cypress.$(nameCell).text()).to.match(/art/i)
                })
            }
        )

        // go to second page
        cy.get('[data-test="dhis2-uiwidgets-pagination-page-next"]').click()

        // wait for second page result
        cy.contains('Receiving ART').should('exist')
        cy.get(
            '[data-test="dhis2-uiwidgets-pagination-page-select-prefix"] + div'
        )
            .invoke('text')
            .should('equal', '2')

        // each data element contains "art" (not case-sensitive)
        cy.get('[data-test^="section-list-row-"] > td:nth-child(2)').then(
            ($nameCells) => {
                $nameCells.each((_, nameCell) => {
                    expect(Cypress.$(nameCell).text()).to.match(/art/i)
                })
            }
        )
    })
})
