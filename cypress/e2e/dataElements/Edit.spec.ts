describe('Data elements / Edit', () => {
    xit('should change a value', () => {
        const now = Date.now()

        cy.visit('/')

        // Open data elements group in side nav
        cy.get('[data-test="sidenav"] button:contains("Data elements")', {
            timeout: 10000,
        }).click()

        // Navigate to data element list view
        cy.get('[data-test="sidenav"] a:contains("Data element")')
            .first() // the selector will also grab "Data element group" and "Data element group set"
            .click()

        // Go to Edit form
        cy.get('[data-test="dhis2-uicore-tablebody"] tr:first-child')
            .find('td:last-child a')
            .click()

        cy.get('[data-test="formfields-description"] textarea').should(
            'not.have.value',
            `description ${now}`
        )

        cy.get('[data-test="formfields-description"] textarea')
            .clear()
            .type(`description ${now}`)

        // Submit form
        cy.get('button:contains("Save and close")').click()

        cy.contains('Data element management').should('exist')

        // Go to Edit form
        cy.get('[data-test="dhis2-uicore-tablebody"] tr:first-child')
            .find('td:last-child a')
            .click()

        cy.get('[data-test="formfields-description"] textarea').should(
            'have.value',
            `description ${now}`
        )
    })

    xit('should not submit successfully when a required value has been removed', () => {
        cy.visit('/')

        // Open data elements group in side nav
        cy.get('[data-test="sidenav"] button:contains("Data elements")', {
            timeout: 10000,
        }).click()

        // Navigate to data element list view
        cy.get('[data-test="sidenav"] a:contains("Data element")')
            .first() // the selector will also grab "Data element group" and "Data element group set"
            .click()

        // Go to Edit form
        cy.get('[data-test="dhis2-uicore-tablebody"] tr:first-child')
            .find('td:last-child a')
            .click()

        cy.get('[data-test="formfields-name"] input').clear()

        // Submit form
        cy.get('button:contains("Save and close")').click()

        // Assert error
        cy.get('[data-test$="-validation"]:contains("Required")').should(
            'have.length',
            1
        )
        cy.get(
            '[data-test="formfields-name-validation"]:contains("Required")'
        ).should('exist')
    })
})
