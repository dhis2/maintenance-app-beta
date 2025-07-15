import { faker } from '@faker-js/faker'
import { render, within } from '@testing-library/react'
import React from 'react'
import schemaMock from '../../__mocks__/schema/dataElementsSchema.json'
import { FOOTER_ID } from '../../app/layout/Layout'
import { getConstantTranslation, SECTIONS_MAP } from '../../lib'
import {
    randomLongString,
    testCategoryCombo,
    testCustomAttribute,
    testDataElement,
    testLegendSet,
    testOptionSet,
    testOrgUnitLevel,
} from '../../testUtils/builders'
import { generateRenderer } from '../../testUtils/generateRenderer'
import TestComponentWithRouter from '../../testUtils/TestComponentWithRouter'
import { uiActions } from '../../testUtils/uiActions'
import { uiAssertions } from '../../testUtils/uiAssertions'
import { DisplayableModel } from '../../types/models'
import { Component as New } from './New'
import resetAllMocks = jest.resetAllMocks

const section = SECTIONS_MAP.dataElement
const mockSchema = schemaMock
jest.mock('use-debounce', () => ({
    useDebouncedCallback: (fn: any) => fn,
}))

describe('Data elements form tests', () => {
    const createMock = jest.fn()

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

    describe('Common', () => {
        const renderForm = generateRenderer(
            { section, mockSchema },
            (
                routeOptions,
                { matchingExistingElementFilter = undefined } = {}
            ) => {
                const attributes = [testCustomAttribute()]

                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}`}
                        customData={{
                            attributes: () => ({ attributes }),
                            dataElements: (type: any, params: any) => {
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
                                            dataElements: [testDataElement()],
                                        }
                                    }
                                    return {
                                        pager: { total: 0 },
                                        dataElements: [],
                                    }
                                }
                            },
                        }}
                        routeOptions={routeOptions}
                    >
                        <New />
                    </TestComponentWithRouter>
                )
                return { screen, attributes }
            }
        )

        it('should not submit when required values are missing', async () => {
            const { screen } = await renderForm()
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
            uiAssertions.expectFieldToHaveError(
                'formfields-name',
                'Required',
                screen
            )
            uiAssertions.expectFieldToHaveError(
                'formfields-shortName',
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
        it('should show an error if short name field is too long', async () => {
            const { screen } = await renderForm()
            const longText = randomLongString(54)
            await uiActions.enterInputFieldValue('shortName', longText, screen)
            await uiAssertions.expectInputToErrorWhenExceedsLength(
                'shortName',
                50,
                screen
            )
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
        })
        it('should show an error if code field is too long', async () => {
            const { screen } = await renderForm()
            const longText = randomLongString(57)
            await uiActions.enterInputFieldValue('code', longText, screen)
            await uiAssertions.expectInputToErrorWhenExceedsLength(
                'code',
                50,
                screen
            )
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
        })
        it('should show an error if form name field is too long', async () => {
            const { screen } = await renderForm()
            const longText = randomLongString(247)
            await uiActions.enterInputFieldValue('formName', longText, screen)
            await uiAssertions.expectInputToErrorWhenExceedsLength(
                'formName',
                230,
                screen
            )
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
        })
        it('should show an error if url field is too long', async () => {
            const { screen } = await renderForm()
            const longText = randomLongString(312)
            await uiActions.enterInputFieldValue('url', longText, screen)
            await uiAssertions.expectInputToErrorWhenExceedsLength(
                'url',
                255,
                screen
            )
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
        })
        it('should show an error if field mask field is too long', async () => {
            const { screen } = await renderForm()
            const longText = randomLongString(312)
            await uiActions.enterInputFieldValue('fieldMask', longText, screen)
            await uiAssertions.expectInputToErrorWhenExceedsLength(
                'fieldMask',
                255,
                screen
            )
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
        })
        it('should show an error if name field is a duplicate', async () => {
            const existingName = faker.company.name()
            const { screen } = await renderForm({
                matchingExistingElementFilter: `name:ieq:${existingName}`,
            })
            await uiAssertions.expectNameToErrorWhenDuplicate(
                existingName,
                screen
            )
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
        })
        it('should show an error if short name field is a duplicate', async () => {
            const existingShortName = faker.company.name()
            const { screen } = await renderForm({
                matchingExistingElementFilter: `shortName:ieq:${existingShortName}`,
            })
            await uiAssertions.expectInputToErrorWhenDuplicate(
                'shortName',
                existingShortName,
                screen
            )
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
        })
        it('should show an error if code field is a duplicate', async () => {
            const existingCode = faker.science.chemicalElement().symbol
            const { screen } = await renderForm({
                matchingExistingElementFilter: `code:ieq:${existingCode}`,
            })
            await uiAssertions.expectCodeToErrorWhenDuplicate(
                existingCode,
                screen
            )
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
        })
    })
    describe('New', () => {
        const renderForm = generateRenderer(
            { section, mockSchema },
            (routeOptions) => {
                const attributes = [testCustomAttribute()]
                const categoryCombos = [
                    testCategoryCombo(),
                    testCategoryCombo(),
                    testCategoryCombo(),
                ]
                const optionSets = [testOptionSet(), testOptionSet()]
                const legendSets = [
                    testLegendSet(),
                    testLegendSet(),
                    testLegendSet(),
                ]
                const organisationUnitLevels = [
                    testOrgUnitLevel({ level: 1 }),
                    testOrgUnitLevel({ level: 2 }),
                ]
                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}`}
                        customData={{
                            attributes: () => ({ attributes }),
                            categoryCombos: () => ({
                                pager: {},
                                categoryCombos,
                            }),
                            optionSets: () => ({ pager: {}, optionSets }),
                            legendSets: () => ({ pager: {}, legendSets }),
                            organisationUnitLevels: () => ({
                                organisationUnitLevels,
                            }),
                            dataElements: (type: any, params: any) => {
                                if (type === 'create') {
                                    createMock(params)
                                    return { statusCode: 204 }
                                }
                                if (type === 'read') {
                                    return {
                                        pager: { total: 0 },
                                        dataElements: [],
                                    }
                                }
                            },
                        }}
                        routeOptions={routeOptions}
                    >
                        <New />
                    </TestComponentWithRouter>
                )
                return {
                    screen,
                    attributes,
                    categoryCombos,
                    optionSets,
                    legendSets,
                    organisationUnitLevels,
                }
            }
        )
        it('contain all needed field', async () => {
            const {
                screen,
                categoryCombos,
                optionSets,
                legendSets,
                organisationUnitLevels,
                attributes,
            } = await renderForm()
            uiAssertions.expectNameFieldExist('', screen)
            uiAssertions.expectInputFieldToExist('shortName', '', screen)
            uiAssertions.expectCodeFieldExist('', screen)
            uiAssertions.expectInputFieldToExist('formName', '', screen)
            uiAssertions.expectTextAreaFieldToExist('description', '', screen)
            uiAssertions.expectInputFieldToExist('url', '', screen)
            uiAssertions.expectInputFieldToExist('fieldMask', '', screen)
            uiAssertions.expectCheckboxFieldToExist(
                'zeroIsSignificant',
                false,
                screen
            )
            uiAssertions.expectRadioFieldToExist(
                'domainType',
                [
                    { label: 'Aggregate', checked: true },
                    {
                        label: 'Tracker',
                        checked: false,
                    },
                ],
                screen
            )
            await uiAssertions.expectSelectToExistWithOptions(
                screen.getByTestId('formfields-valueType'),
                {
                    selected: 'Text',
                    options: mockSchema.properties.valueType.constants
                        .filter((o) => o !== 'MULTI_TEXT')
                        .map((o) => ({
                            displayName: getConstantTranslation(o),
                        })),
                },
                screen
            )

            const aggregationType = within(
                screen.getByTestId('formfields-aggregationType')
            ).getByTestId('dhis2-uicore-select-input')
            expect(aggregationType).toBeVisible()
            expect(aggregationType).toHaveTextContent('None')

            await uiAssertions.expectSelectToExistWithOptions(
                screen.getByTestId('formfields-categorycombo'),
                {
                    selected: 'None',
                    options: [
                        { displayName: 'None' },
                        ...categoryCombos.map((cc: DisplayableModel) => ({
                            displayName: cc.displayName,
                        })),
                    ],
                },
                screen
            )
            await uiAssertions.expectSelectToExistWithOptions(
                screen.getByTestId('formfields-optionset'),
                {
                    options: [
                        { displayName: '<No value>' },
                        ...optionSets.map((cc: DisplayableModel) => ({
                            displayName: cc.displayName,
                        })),
                    ],
                },
                screen
            )
            await uiAssertions.expectSelectToExistWithOptions(
                screen.getByTestId('formfields-commentoptionset'),
                {
                    options: [
                        { displayName: '<No value>' },
                        ...optionSets.map((cc: DisplayableModel) => ({
                            displayName: cc.displayName,
                        })),
                    ],
                },
                screen
            )
            await uiAssertions.expectTransferFieldToExistWithOptions(
                'legendset-transfer',
                { lhs: legendSets, rhs: [] },
                screen
            )

            await uiAssertions.expectMultiSelectToExistWithOptions(
                screen.getByTestId('formfields-aggregationlevels'),
                {
                    selected: [],
                    options: organisationUnitLevels,
                },
                screen
            )

            attributes.forEach((attribute: { id: string }) => {
                expect(
                    screen.getByTestId(`attribute-${attribute.id}`)
                ).toBeVisible()
            })
        })
        it('should have a cancel button with a link back to the list view', async () => {
            const { screen } = await renderForm()
            const cancelButton = screen.getByTestId('form-cancel-link')
            expect(cancelButton).toBeVisible()
            expect(cancelButton).toHaveAttribute(
                'href',
                `/${section.namePlural}`
            )
        })
        it('should submit the data', () => {})
    })
    describe('Edit', () => {
        it('contain all needed field prefilled', () => {})
        it('should have a cancel button with a link back to the list view', () => {})
        it('should submit the data and return to the list view on success when a field is changed', () => {})
        it('should do nothing and return to the list view on success when no field is changed', () => {})
    })
})
