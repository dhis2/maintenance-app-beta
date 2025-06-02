import { faker } from '@faker-js/faker'
import { render } from '@testing-library/react'
import React from 'react'
import schemaMock from '../../__mocks__/schema/programIndicatorGroupsSchema.json'
import { FOOTER_ID } from '../../app/layout/Layout'
import { SECTIONS_MAP } from '../../lib'
import {
    randomDhis2Id,
    testFormProgramIndicatorGroup,
    testProgramIndicator,
    testProgramIndicatorGroup,
} from '../../testUtils/builders'
import { generateRenderer } from '../../testUtils/generateRenderer'
import TestComponentWithRouter from '../../testUtils/TestComponentWithRouter'
import { uiActions } from '../../testUtils/uiActions'
import { uiAssertions } from '../../testUtils/uiAssertions'
import { Component } from './Edit'
import resetAllMocks = jest.resetAllMocks

const section = SECTIONS_MAP.programIndicatorGroup
const mockSchema = schemaMock
const ComponentToTest = Component
jest.mock('use-debounce', () => ({
    useDebouncedCallback: (fn: any) => fn,
}))

describe('Program indicator group edit form tests', () => {
    const updateMock = jest.fn()
    const renderForm = generateRenderer(
        { section, mockSchema },
        (
            routeOptions,
            {
                id = randomDhis2Id(),
                matchingExistingElementFilter = undefined,
            } = {}
        ) => {
            const programIndicators = [
                testProgramIndicator(),
                testProgramIndicator(),
                testProgramIndicator(),
                testProgramIndicator(),
                testProgramIndicator(),
            ]
            const programIndicatorGroup = testFormProgramIndicatorGroup({
                id,
                programIndicators: [programIndicators[0], programIndicators[2]],
            })
            const screen = render(
                <TestComponentWithRouter
                    path={`/${section.namePlural}/:id`}
                    initialEntries={[`/${section.namePlural}/${id}`]}
                    customData={{
                        programIndicators: (type: any, params: any) => {
                            if (type === 'read') {
                                return {
                                    pager: {},
                                    programIndicators: programIndicators,
                                }
                            }
                        },
                        programIndicatorGroups: (type: any, params: any) => {
                            if (type === 'read') {
                                if (params?.id) {
                                    return programIndicatorGroup
                                }
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
                            if (type === 'json-patch') {
                                updateMock(params)
                                return { statusCode: 204 }
                            }
                        },
                    }}
                    routeOptions={routeOptions}
                >
                    <ComponentToTest />
                </TestComponentWithRouter>
            )
            return { screen, programIndicators, programIndicatorGroup }
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
        const { screen, programIndicators, programIndicatorGroup } =
            await renderForm()
        uiAssertions.expectNameFieldExist(programIndicatorGroup.name, screen)
        uiAssertions.expectCodeFieldExist(programIndicatorGroup.code, screen)
        await uiAssertions.expectTransferFieldToExistWithOptions(
            'program-indicators-transfer',
            {
                lhs: [
                    programIndicators[1],
                    programIndicators[3],
                    programIndicators[4],
                ],
                rhs: [programIndicators[0], programIndicators[2]],
            },
            screen
        )
    })
    it('should should return to the list view when cancelling', async () => {
        const { screen } = await renderForm()

        const cancelButton = screen.getByTestId('form-cancel-link')
        expect(cancelButton).toBeVisible()
        expect(cancelButton).toHaveAttribute('href', `/${section.namePlural}`)
    })
    it('should not submit when required values are missing', async () => {
        const { screen } = await renderForm()
        await uiActions.clearInputField('name', screen)
        await uiActions.submitForm(screen)
        expect(updateMock).not.toHaveBeenCalled()
        uiAssertions.expectFieldToHaveError(
            'formfields-name',
            'Required',
            screen
        )
    })
    it('should submit the data and return to the list view on success', async () => {
        const { screen, programIndicators, programIndicatorGroup } =
            await renderForm()
        const newCode = faker.science.chemicalElement().symbol
        const additionalPiIndicator = programIndicators[1]
        await uiActions.clearInputField('code', screen)
        await uiActions.enterCode(newCode, screen)
        await uiActions.pickOptionInTransfer(
            'program-indicators-transfer',
            additionalPiIndicator.displayName,
            screen
        )
        await uiActions.submitForm(screen)
        expect(updateMock).toHaveBeenCalledTimes(1)
        expect(updateMock).toHaveBeenLastCalledWith(
            expect.objectContaining({
                id: programIndicatorGroup.id,
                data: [
                    { op: 'replace', path: '/code', value: newCode },
                    {
                        op: 'replace',
                        path: '/programIndicators',
                        value: [
                            ...programIndicatorGroup.programIndicators,
                            programIndicators[1],
                        ],
                    },
                ],
            })
        )
    })
    it('should do nothing and return to the list view on success when no field is changed', async () => {
        const { screen } = await renderForm()
        await uiActions.submitForm(screen)
        expect(updateMock).not.toHaveBeenCalled()
    })

    it('should show an error if name field is too long', async () => {
        const { screen } = await renderForm()
        await uiAssertions.expectNameToErrorWhenExceedsLength(screen)
        await uiActions.submitForm(screen)
        expect(updateMock).not.toHaveBeenCalled()
    })
    it('should show an error if code field is too long', async () => {
        const { screen } = await renderForm()
        await uiAssertions.expectCodeToErrorWhenExceedsLength(screen)
        await uiActions.submitForm(screen)
        expect(updateMock).not.toHaveBeenCalled()
    })
    it('should show an error if name field is a duplicate', async () => {
        const existingName = faker.company.name()
        const { screen } = await renderForm({
            matchingExistingElementFilter: `name:ieq:${existingName}`,
        })
        await uiActions.clearInputField('name', screen)
        await uiAssertions.expectNameToErrorWhenDuplicate(existingName, screen)
        await uiActions.submitForm(screen)
        expect(updateMock).not.toHaveBeenCalled()
    })
    it('should show an error if code field is a duplicate', async () => {
        const existingCode = faker.science.chemicalElement().symbol
        const { screen } = await renderForm({
            matchingExistingElementFilter: `code:ieq:${existingCode}`,
        })
        await uiActions.clearInputField('code', screen)

        await uiAssertions.expectCodeToErrorWhenDuplicate(existingCode, screen)
        await uiActions.submitForm(screen)
        expect(updateMock).not.toHaveBeenCalled()
    })
})
