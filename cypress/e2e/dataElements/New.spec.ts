describe('Data elements / New', () => {
    xit('should create a data element with only the required values', () => {
        const now = Date.now()
        const newDataElementName = `ZZZ ${now}` // Will be at the end, does not pollute the first page of the list

        cy.visit('/')

        // Open data elements group in side nav
        cy.get('[data-test="sidenav"] button:contains("Data elements")', {
            timeout: 10000,
        }).click()

        // Navigate to data element list view
        cy.get('[data-test="sidenav"] a:contains("Data element")')
            .first() // the selector will also grab "Data element group" and "Data element group set"
            .click()

        // Go to New form
        cy.get('button:contains("New")').click()

        cy.get('[data-test="formfields-name-content"] input').type(
            newDataElementName
        )
        cy.get('[data-test="formfields-shortname-content"] input').type(
            `shortname ${now}`
        )

        // verify default catcombo is selected
        cy.get(
            '[data-test="formfields-categorycombo"] [data-test="dhis2-uicore-select-input"]'
        ).should('contain', 'None')

        // Submit form
        cy.get('button:contains("Create data element")').click()

        cy.contains('Data element management').should('exist')
    })

    xit('should create a data element with all values', () => {
        const now = Date.now()
        const newDataElementName = `ZZZ ${now}` // Will be at the end, does not pollute the first page of the list

        cy.visit('/')

        // Open data elements group in side nav
        cy.get('[data-test="sidenav"] button:contains("Data elements")', {
            timeout: 10000,
        }).click()

        // Navigate to data element list view
        cy.get('[data-test="sidenav"] a:contains("Data element")')
            .first() // the selector will also grab "Data element group" and "Data element group set"
            .click()

        // Go to New form
        cy.get('button:contains("New")').click()

        cy.get('[data-test="formfields-name"] input').type(newDataElementName)
        cy.get('[data-test="formfields-shortname"] input').type(
            `Short name ${now}`
        )
        cy.get('[data-test="formfields-formname"] input').type(
            `Form name ${now}`
        )
        cy.get('[data-test="formfields-code"] input').type(`Code ${now}`)
        cy.get('[data-test="formfields-description"] textarea').type(
            `Multiline{enter}description ${now}`
        )
        cy.get('[data-test="formfields-url"] input').type(
            `https://dhis2.org ${now}`
        )

        // pick color
        cy.get('[data-test="colorpicker-trigger"]').click()
        cy.get('[title="#b71c1c"]').click()

        // icon color
        cy.get('[data-test="iconpicker-trigger"]').click()
        cy.get('[data-test="dhis2-uicore-modal"] img[src$="/icon"]')
            .first()
            .click()
        cy.get(
            '[data-test="dhis2-uicore-modal"] button:contains("Select")'
        ).click()

        cy.get('[data-test="formfields-fieldmask"] input').type(
            `000 1111 000 ${now}`
        )
        cy.get('[data-test="formfields-zeroissignificant"] input').check()

        // Select value type
        cy.get(
            '[data-test="formfields-valuetype"] [data-test="dhis2-uicore-select-input"]'
        ).click()
        cy.get(
            '[data-test="dhis2-uicore-singleselectoption"]:contains("Integer")'
        ).click()

        // Select aggregation type
        cy.get(
            '[data-test="formfields-aggregationtype"] [data-test="dhis2-uicore-select-input"]'
        ).click()
        cy.get(
            '[data-test="dhis2-uicore-singleselectoption"]:contains("Sum")'
        ).click()

        // Select option set
        cy.get(
            '[data-test="formfields-optionset"] [data-test="dhis2-uicore-select-input"]'
        ).click()
        cy.get(
            '[data-test="dhis2-uicore-singleselectoption"]:contains("ARV drugs")'
        ).click()

        // Select comment optionset combo
        cy.get(
            '[data-test="formfields-commentoptionset"] [data-test="dhis2-uicore-select-input"]'
        ).click()
        cy.get(
            '[data-test="dhis2-uicore-singleselectoption"]:contains("ARV treatment plan")'
        ).click()

        // Select legend sets
        cy.get(
            '[data-test="formfields-legendsets"] [data-test="dhis2-uicore-transferoption"]:contains("ANC Coverage")'
        ).dblclick()
        cy.get(
            '[data-test="formfields-legendsets"] [data-test="dhis2-uicore-transferoption"]:contains("Age 10y interval")'
        ).dblclick()

        // Select aggregation levels
        cy.get(
            '[data-test="formfields-aggregationlevels"] [data-test="dhis2-uicore-select-input"]'
        ).click()
        cy.get(
            '[data-test="dhis2-uicore-checkbox"]:contains("Chiefdom")'
        ).click()
        cy.get(
            '[data-test="dhis2-uicore-checkbox"]:contains("District")'
        ).click()
        cy.get('.backdrop').click()

        // Select custom attribute "Classification"
        cy.get(
            '[data-test="dhis2-uiwidgets-singleselectfield"]:contains("Classification") [data-test="dhis2-uicore-select-input"]'
        ).click()
        cy.get(
            '[data-test="dhis2-uicore-singleselectoption"]:contains("Input")'
        ).click()

        cy.get('[name="attributeValues[1].value"]').type(
            `Collection{enter}method! ${now}`
        )
        cy.get('[name="attributeValues[2].value"]').type(`PEPFAR ID! ${now}`)
        cy.get('[name="attributeValues[3].value"]').type(`Rationale! ${now}`)
        cy.get('[name="attributeValues[4].value"]').type(
            `Unit of measure! ${now}`
        )

        // Submit form
        cy.get('button:contains("Create data element")').click()

        cy.contains('Data element management').should('exist')
    })

    xit('should not create a DE when reuired fields are missing', () => {
        cy.visit('/')

        // Open data elements group in side nav
        cy.get('[data-test="sidenav"] button:contains("Data elements")', {
            timeout: 10000,
        }).click()

        // Navigate to data element list view
        cy.get('[data-test="sidenav"] a:contains("Data element")')
            .first() // the selector will also grab "Data element group" and "Data element group set"
            .click()

        // Go to New form
        cy.get('button:contains("New")').click()

        // Submit form
        cy.get('button:contains("Create data element")').click()

        // Should have required errors for name, shortname
        cy.get('[data-test$="-validation"]:contains("Required")').should(
            'have.length',
            2
        )
        cy.get(
            '[data-test="formfields-name-validation"]:contains("Required")'
        ).should('exist')
        cy.get(
            '[data-test="formfields-shortname-validation"]:contains("Required")'
        ).should('exist')
    })
})
