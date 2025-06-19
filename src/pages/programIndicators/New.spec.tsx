import { faker } from '@faker-js/faker'
import { render } from '@testing-library/react'
import React from 'react'
import schemaMock from '../../__mocks__/schema/programIndicatorsSchema.json'
import { FOOTER_ID } from '../../app/layout/Layout'
import { getConstantTranslation, SECTIONS_MAP } from '../../lib'
import {
    randomDhis2Id,
    randomLongString,
    testCustomAttribute,
    testLegendSets,
    testProgram,
    testProgramIndicator,
    testProgramIndicatorGroup,
} from '../../testUtils/builders'
import { generateRenderer } from '../../testUtils/generateRenderer'
import TestComponentWithRouter from '../../testUtils/TestComponentWithRouter'
import { uiActions } from '../../testUtils/uiActions'
import { uiAssertions } from '../../testUtils/uiAssertions'
import { Component } from './New'
import resetAllMocks = jest.resetAllMocks

const section = SECTIONS_MAP.programIndicator
const mockSchema = schemaMock
const ComponentToTest = Component
jest.mock('use-debounce', () => ({
    useDebouncedCallback: (fn: any) => fn,
}))

describe('Program indicator add form tests', () => {
    const createMock = jest.fn()
    const renderForm = generateRenderer(
        { section, mockSchema },
        (routeOptions, { matchingExistingElementFilter = undefined } = {}) => {
            const attributes = [testCustomAttribute()]
            const programs = [testProgram(), testProgram(), testProgram()]
            const legendSets = [testLegendSets(), testLegendSets()]
            const screen = render(
                <TestComponentWithRouter
                    path={`/${section.namePlural}`}
                    customData={{
                        attributes: () => ({ attributes }),
                        programs: () => ({ programs }),
                        legendSets: () => ({ legendSets }),
                        programIndicators: (type: any, params: any) => {
                            if (type === 'create') {
                                createMock(params)
                                return { statusCode: 204 }
                            }
                        },
                    }}
                    routeOptions={routeOptions}
                >
                    <ComponentToTest />
                </TestComponentWithRouter>
            )
            return { screen, attributes, programs, legendSets }
        }
    )

    beforeEach(() => {
        resetAllMocks()
        const portalRoot = document.createElement('div')
        portalRoot.setAttribute('id', FOOTER_ID)
        document.body.appendChild(portalRoot)
    })

    afterEach(() => {
        const portalRoot = document.getElementById(FOOTER_ID)
        if (portalRoot) {
            portalRoot.remove()
        }
    })

    it('contain all needed field', async () => {
        const { screen, programs, legendSets, attributes } = await renderForm()
        await uiAssertions.expectSelectToExistWithOption(
            screen.getByTestId('programs-field'),
            programs,
            screen
        )
        uiAssertions.expectNameFieldExist('', screen)
        uiAssertions.expectInputFieldToExist('shortName', '', screen)
        uiAssertions.expectCodeFieldExist('', screen)
        uiAssertions.expectColorAndIconFieldToExist(screen)
        uiAssertions.expectTextAreaFieldToExist('description', null, screen)
        const expectedDecimalsOptions = [
            { displayName: '<No value>' },
            { displayName: '0' },
            { displayName: '1' },
            { displayName: '2' },
            { displayName: '3' },
            { displayName: '4' },
            { displayName: '5' },
        ]
        await uiAssertions.expectSelectToExistWithOption(
            screen.getByTestId('decimals-field'),
            expectedDecimalsOptions,
            screen
        )
        await uiAssertions.expectSelectToExistWithOption(
            screen.getByTestId('aggregation-type-field'),
            mockSchema.properties.aggregationType.constants.map((o) => ({
                displayName: getConstantTranslation(o),
            })),
            screen
        )
        await uiAssertions.expectSelectToExistWithOption(
            screen.getByTestId('analytics-type-field'),
            mockSchema.properties.analyticsType.constants.map((o) => ({
                displayName: getConstantTranslation(o),
            })),
            screen
        )

        uiAssertions.expectCheckboxFieldToExist('displayInForm', false, screen)
        uiAssertions.expectInputFieldToExist(
            'aggregateExportCategoryOptionCombo',
            '',
            screen
        )
        uiAssertions.expectInputFieldToExist(
            'aggregateExportAttributeOptionCombo',
            '',
            screen
        )
        uiAssertions.expectInputFieldToExist(
            'aggregateExportDataElement',
            '',
            screen
        )
        expect(screen.getByTestId('add-boundary-button')).toBeVisible()
        uiAssertions.expectTransferFieldToExistWithOptions(
            'legendSets-field',
            { lhs: legendSets, rhs: [] },
            screen
        )
        attributes.forEach((attribute: { id: string }) => {
            expect(
                screen.getByTestId(`attribute-${attribute.id}`)
            ).toBeVisible()
        })
    })
    it('should show the org unit field when...', () => {})
    xit('should have a cancel button with a link back to the list view', async () => {
        const { screen } = await renderForm()
        const cancelButton = screen.getByTestId('form-cancel-link')
        expect(cancelButton).toBeVisible()
        expect(cancelButton).toHaveAttribute('href', `/${section.namePlural}`)
    })
    xit('should not submit when required values are missing', async () => {
        const { screen } = await renderForm()
        await uiActions.submitForm(screen)
        expect(createMock).not.toHaveBeenCalled()
        uiAssertions.expectFieldToHaveError(
            'formfields-name',
            'Required',
            screen
        )
    })
    xit('should submit the data', async () => {
        const { screen, programIndicators } = await renderForm()
        const aName = faker.internet.userName()
        const aCode = faker.science.chemicalElement().symbol
        const selectedPiIndicator = programIndicators[1]
        await uiActions.enterName(aName, screen)
        await uiActions.enterCode(aCode, screen)
        await uiActions.pickOptionInTransfer(
            'program-indicators-transfer',
            selectedPiIndicator.displayName,
            screen
        )
        await uiActions.submitForm(screen)
        expect(createMock).toHaveBeenCalledTimes(1)
        expect(createMock).toHaveBeenLastCalledWith(
            expect.objectContaining({
                id: undefined,
                data: {
                    id: undefined,
                    name: aName,
                    code: aCode,
                    programIndicators: [selectedPiIndicator],
                },
            })
        )
    })
    xit('should show an error if name field is too long', async () => {
        const { screen } = await renderForm()
        const longText = randomLongString(231)
        await uiActions.enterName(longText, screen)
        await uiAssertions.expectNameToErrorWhenExceedsLength(screen)
        await uiActions.submitForm(screen)
        expect(createMock).not.toHaveBeenCalled()
    })
    xit('should show an error if code field is too long', async () => {
        const { screen } = await renderForm()
        const longText = randomLongString(60)
        await uiActions.enterCode(longText, screen)
        await uiAssertions.expectCodeToErrorWhenExceedsLength(screen)
        await uiActions.submitForm(screen)
        expect(createMock).not.toHaveBeenCalled()
    })
    xit('should show an error if name field is a duplicate', async () => {
        const existingName = faker.company.name()
        const { screen } = await renderForm({
            matchingExistingElementFilter: `name:ieq:${existingName}`,
        })
        await uiAssertions.expectNameToErrorWhenDuplicate(existingName, screen)
        await uiActions.submitForm(screen)
        expect(createMock).not.toHaveBeenCalled()
    })
    xit('should show an error if code field is a duplicate', async () => {
        const existingCode = faker.science.chemicalElement().symbol
        const { screen } = await renderForm({
            matchingExistingElementFilter: `code:ieq:${existingCode}`,
        })
        await uiAssertions.expectCodeToErrorWhenDuplicate(existingCode, screen)
        await uiActions.submitForm(screen)
        expect(createMock).not.toHaveBeenCalled()
    })
})
