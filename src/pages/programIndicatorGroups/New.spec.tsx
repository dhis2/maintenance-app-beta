import { faker } from '@faker-js/faker'
import { render } from '@testing-library/react'
import React from 'react'
import schemaMock from '../../__mocks__/schema/programIndicatorGroupsSchema.json'
import { SECTIONS_MAP } from '../../lib'
import {
    randomLongString,
    testProgramIndicator,
    testProgramIndicatorGroup,
} from '../../testUtils/builders'
import { generateRenderer } from '../../testUtils/generateRenderer'
import TestComponentWithRouter from '../../testUtils/TestComponentWithRouter'
import { uiActions } from '../../testUtils/uiActions'
import { uiAssertions } from '../../testUtils/uiAssertions'
import { Component } from './New'
import resetAllMocks = jest.resetAllMocks

const section = SECTIONS_MAP.programIndicatorGroup
const mockSchema = schemaMock
const ComponentToTest = Component
jest.mock('use-debounce', () => ({
    useDebouncedCallback: (fn: any) => fn,
}))

describe('Program indicator group add form tests', () => {
    const createMock = jest.fn()
    const renderForm = generateRenderer(
        { section, mockSchema },
        (routeOptions, { matchingExistingElementFilter = undefined } = {}) => {
            const programIndicators = [
                testProgramIndicator(),
                testProgramIndicator(),
            ]
            const screen = render(
                <TestComponentWithRouter
                    path={`/${section.namePlural}`}
                    customData={{
                        programIndicators: (type: any) => {
                            if (type === 'read') {
                                return {
                                    pager: {},
                                    programIndicators: programIndicators,
                                }
                            }
                        },
                        programIndicatorGroups: (type: any, params: any) => {
                            if (type === 'create') {
                                createMock(params)
                                return { statusCode: 204 }
                            }
                            if (type === 'read') {
                                if (
                                    params?.params?.filter?.includes(
                                        matchingExistingElementFilter
                                    )
                                ) {
                                    return {
                                        pager: { total: 1 },
                                        programIndicatorGroups: [
                                            testProgramIndicatorGroup(),
                                        ],
                                    }
                                }
                                return {
                                    pager: { total: 0 },
                                    programIndicatorGroups: [],
                                }
                            }
                        },
                    }}
                    routeOptions={routeOptions}
                >
                    <ComponentToTest />
                </TestComponentWithRouter>
            )
            return { screen, programIndicators }
        }
    )

    beforeEach(() => {
        resetAllMocks()
    })

    it('contain all needed field', async () => {
        const { screen, programIndicators } = await renderForm()
        uiAssertions.expectNameFieldExist('', screen)
        uiAssertions.expectCodeFieldExist('', screen)
        uiAssertions.expectTransferFieldToExistWithOptions(
            'program-indicators-transfer',
            { lhs: programIndicators, rhs: [] },
            screen
        )
    })
    it('should have a cancel button with a link back to the list view', async () => {
        const { screen } = await renderForm()
        const cancelButton = screen.getByTestId('form-cancel-link')
        expect(cancelButton).toBeVisible()
        expect(cancelButton).toHaveAttribute('href', `/${section.namePlural}`)
    })
    it('should submit the data', async () => {
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
    it('should not submit when required values are missing', async () => {
        const { screen } = await renderForm()
        await uiActions.submitForm(screen)
        expect(createMock).not.toHaveBeenCalled()
        uiAssertions.expectFieldToHaveError(
            'formfields-name',
            'Required',
            screen
        )
    })
    it('should show an error if name field is too long', async () => {
        const { screen } = await renderForm()
        const longText = randomLongString(231)
        await uiActions.enterName(longText, screen)
        await uiAssertions.expectNameToErrorWhenExceedsLength(screen)
        await uiActions.submitForm(screen)
        expect(createMock).not.toHaveBeenCalled()
    })
    it('should show an error if code field is too long', async () => {
        const { screen } = await renderForm()
        const longText = randomLongString(60)
        await uiActions.enterCode(longText, screen)
        await uiAssertions.expectCodeToErrorWhenExceedsLength(screen)
        await uiActions.submitForm(screen)
        expect(createMock).not.toHaveBeenCalled()
    })
    it('should show an error if name field is a duplicate', async () => {
        const existingName = faker.company.name()
        const { screen } = await renderForm({
            matchingExistingElementFilter: `name:ieq:${existingName}`,
        })
        await uiAssertions.expectNameToErrorWhenDuplicate(existingName, screen)
        await uiActions.submitForm(screen)
        expect(createMock).not.toHaveBeenCalled()
    })
    it('should show an error if code field is a duplicate', async () => {
        const existingCode = faker.science.chemicalElement().symbol
        const { screen } = await renderForm({
            matchingExistingElementFilter: `code:ieq:${existingCode}`,
        })
        await uiAssertions.expectCodeToErrorWhenDuplicate(existingCode, screen)
        await uiActions.submitForm(screen)
        expect(createMock).not.toHaveBeenCalled()
    })
})
