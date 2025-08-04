import { faker } from '@faker-js/faker'
import { render, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import schemaMock from '../../__mocks__/schema/indicators.json'
import { FOOTER_ID } from '../../app/layout/Layout'
import { SECTIONS_MAP } from '../../lib'
import {
    randomDhis2Id,
    randomLongString,
    testCustomAttribute,
    testLegendSet,
    testIndicator,
    testIndicatorType,
} from '../../testUtils/builders'
import { generateRenderer } from '../../testUtils/generateRenderer'
import TestComponentWithRouter from '../../testUtils/TestComponentWithRouter'
import { uiActions } from '../../testUtils/uiActions'
import { uiAssertions } from '../../testUtils/uiAssertions'
import { Component as Edit } from './Edit'
import { Component as New } from './New'
import resetAllMocks = jest.resetAllMocks

const section = SECTIONS_MAP.indicator
const mockSchema = schemaMock

jest.mock('use-debounce', () => ({
    useDebouncedCallback: (fn: any) => fn,
}))

describe('Indicators form tests', () => {
    const createMock = jest.fn()
    const updateMock = jest.fn()

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
                {
                    customTestData = {},
                    matchingExistingElementFilter = undefined,
                } = {}
            ) => {
                const attributes = [testCustomAttribute()]
                const indicatorTypes = [
                    testIndicatorType(),
                    testIndicatorType(),
                    testIndicatorType(),
                ]
                const legendSets = [testLegendSet(), testLegendSet()]
                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}`}
                        customData={{
                            attributes: () => ({ attributes }),
                            indicatorTypes: () => ({ indicatorTypes }),
                            legendSets: () => ({
                                legendSets,
                                pager: {
                                    page: 1,
                                    total: 2,
                                    pageSize: 20,
                                    pageCount: 1,
                                },
                            }),
                            indicators: (type: any, params: any) => {
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
                                            indicators: [testIndicator()],
                                        }
                                    }
                                    return {
                                        pager: { total: 0 },
                                        indicators: [],
                                    }
                                }
                            },
                            'indicators/expression/description': () => ({
                                status: 'OK',
                            }),
                            ...customTestData,
                        }}
                        routeOptions={routeOptions}
                    >
                        <New />
                    </TestComponentWithRouter>
                )
                return { screen, attributes, indicatorTypes, legendSets }
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
            uiAssertions.expectFieldToHaveError(
                'formfields-indicatortype',
                'Required',
                screen
            )
            uiAssertions.expectFieldToHaveError(
                'formfields-numerator',
                'Required',
                screen
            )
            uiAssertions.expectFieldToHaveError(
                'formfields-denominator',
                'Required',
                screen
            )
            uiAssertions.expectFieldToHaveError(
                'formfields-numeratorDescription',
                'Required',
                screen
            )
            uiAssertions.expectFieldToHaveError(
                'formfields-denominatorDescription',
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

        it('should show an error if numerator expression is malformed', async () => {
            const { screen } = await renderForm({
                customTestData: {
                    'indicators/expression/description': () => ({
                        status: 'ERROR',
                    }),
                },
            })
            const anExpression = faker.finance.routingNumber()
            await uiActions.enterInputFieldValue(
                `numerator`,
                anExpression,
                screen
            )
            await userEvent.click(screen.getByTestId(`formfields-numerator`))

            uiAssertions.expectFieldToHaveError(
                `formfields-numerator`,
                'Invalid expression',
                screen
            )
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
        })

        it('should show an error if denominator expression is malformed', async () => {
            const { screen } = await renderForm({
                customTestData: {
                    'indicators/expression/description': () => ({
                        status: 'ERROR',
                    }),
                },
            })
            const anExpression = faker.finance.routingNumber()
            await uiActions.enterInputFieldValue(
                `denominator`,
                anExpression,
                screen
            )
            await userEvent.click(screen.getByTestId(`formfields-denominator`))

            uiAssertions.expectFieldToHaveError(
                `formfields-denominator`,
                'Invalid expression',
                screen
            )
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
        })

        it('should show an error if URL field is invalid', async () => {
            const { screen } = await renderForm()
            const invalidUrl = 'not-a-valid-url'
            await uiActions.enterInputFieldValue('url', invalidUrl, screen)
            await uiActions.submitForm(screen)

            uiAssertions.expectFieldToHaveError(
                'formfields-url',
                'Invalid url',
                screen
            )
            expect(createMock).not.toHaveBeenCalled()
        })

        it('should show an error if decimals is out of range', async () => {
            const { screen } = await renderForm()
            await uiActions.pickOptionFromSelect(
                screen.getByTestId('decimals-field'),
                7,
                screen
            )
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
        })
    })

    describe('New', () => {
        const renderForm = generateRenderer(
            { section, mockSchema },
            (
                routeOptions,
                {
                    customTestData = {},
                    matchingExistingElementFilter = undefined,
                } = {}
            ) => {
                const attributes = [testCustomAttribute({ mandatory: false })]
                const indicatorTypes = [
                    testIndicatorType(),
                    testIndicatorType(),
                    testIndicatorType(),
                ]
                const legendSets = [testLegendSet(), testLegendSet()]
                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}`}
                        customData={{
                            attributes: () => ({ attributes }),
                            indicatorTypes: () => ({ indicatorTypes }),
                            legendSets: () => ({
                                legendSets,
                                pager: {
                                    page: 1,
                                    total: 2,
                                    pageSize: 20,
                                    pageCount: 1,
                                },
                            }),
                            indicators: (type: any, params: any) => {
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
                                            indicators: [testIndicator()],
                                        }
                                    }
                                    return {
                                        pager: { total: 0 },
                                        indicators: [],
                                    }
                                }
                            },
                            'indicators/expression/description': () => ({
                                status: 'OK',
                            }),
                            ...customTestData,
                        }}
                        routeOptions={routeOptions}
                    >
                        <New />
                    </TestComponentWithRouter>
                )
                return { screen, attributes, indicatorTypes, legendSets }
            }
        )

        it('contain all needed field', async () => {
            const { screen, indicatorTypes, legendSets, attributes } =
                await renderForm()

            // Basic Information Fields
            uiAssertions.expectNameFieldExist('', screen)
            uiAssertions.expectInputFieldToExist('shortName', '', screen)
            uiAssertions.expectCodeFieldExist('', screen)
            uiAssertions.expectColorAndIconFieldToExist(screen)
            uiAssertions.expectTextAreaFieldToExist('description', null, screen)
            uiAssertions.expectInputFieldToExist('url', '', screen)

            // Configuration Fields
            await uiAssertions.expectSelectToExistWithOptions(
                screen.getByTestId('formfields-indicatortype'),
                { options: indicatorTypes },
                screen
            )

            const expectedDecimalsOptions = [
                { displayName: '<No value>' },
                { displayName: '0' },
                { displayName: '1' },
                { displayName: '2' },
                { displayName: '3' },
                { displayName: '4' },
                { displayName: '5' },
            ]
            await uiAssertions.expectSelectToExistWithOptions(
                screen.getByTestId('decimals-field'),
                { options: expectedDecimalsOptions },
                screen
            )

            uiAssertions.expectCheckboxFieldToExist('annualized', false, screen)

            // Expression Fields
            uiAssertions.expectTextAreaFieldToExist('numerator', null, screen)
            uiAssertions.expectTextAreaFieldToExist('denominator', null, screen)
            uiAssertions.expectTextAreaFieldToExist(
                'numeratorDescription',
                null,
                screen
            )
            uiAssertions.expectTextAreaFieldToExist(
                'denominatorDescription',
                null,
                screen
            )

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

            await uiAssertions.expectTransferFieldToExistWithOptions(
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

        it('should have a cancel button with a link back to the list view', async () => {
            const { screen } = await renderForm()
            const cancelButton = screen.getByTestId('form-cancel-link')
            expect(cancelButton).toBeVisible()
            expect(cancelButton).toHaveAttribute(
                'href',
                `/${section.namePlural}`
            )
        })

        it('should submit the data', async () => {
            const aName = faker.internet.userName()
            const aShortName = faker.internet.userName()
            const aCode = faker.science.chemicalElement().symbol
            const aDescription = faker.company.buzzPhrase()
            const aUrl = faker.internet.url()
            const aNumerator = faker.number.int().toString()
            const aDenominator = faker.number.int().toString()
            const aNumeratorDescription = faker.lorem.sentence()
            const aDenominatorDescription = faker.lorem.sentence()
            const aCatOptionExport = faker.internet.userName()
            const anAttOptionExport = faker.internet.userName()
            const anAttribute = faker.internet.userName()

            const { screen, indicatorTypes, legendSets, attributes } =
                await renderForm()

            await uiActions.enterName(aName, screen)
            await uiActions.enterInputFieldValue(
                'shortName',
                aShortName,
                screen
            )
            await uiActions.enterCode(aCode, screen)
            await uiActions.enterInputFieldValue(
                'description',
                aDescription,
                screen
            )
            await uiActions.enterInputFieldValue('url', aUrl, screen)

            const indicatorTypeOptions = await uiActions.openSingleSelect(
                screen.getByTestId('formfields-indicatortype'),
                screen
            )
            await userEvent.click(indicatorTypeOptions[0])
            await uiActions.closeSingleSelectIfOpen(
                screen.getByTestId('formfields-indicatortype'),
                screen
            )

            const decimalsOptions = await uiActions.openSingleSelect(
                screen.getByTestId('decimals-field'),
                screen
            )
            await userEvent.click(decimalsOptions[2])
            await uiActions.closeSingleSelectIfOpen(
                screen.getByTestId('decimals-field'),
                screen
            )

            await uiActions.clickOnCheckboxField('annualized', screen)

            await uiActions.enterInputFieldValue(
                'numerator',
                aNumerator,
                screen
            )
            await uiActions.enterInputFieldValue(
                'denominator',
                aDenominator,
                screen
            )
            await uiActions.enterInputFieldValue(
                'numeratorDescription',
                aNumeratorDescription,
                screen
            )
            await uiActions.enterInputFieldValue(
                'denominatorDescription',
                aDenominatorDescription,
                screen
            )

            await uiActions.enterInputFieldValue(
                'aggregateExportCategoryOptionCombo',
                aCatOptionExport,
                screen
            )
            await uiActions.enterInputFieldValue(
                'aggregateExportAttributeOptionCombo',
                anAttOptionExport,
                screen
            )

            await uiActions.pickOptionInTransfer(
                'legendSets-field',
                legendSets[0].displayName,
                screen
            )

            const attributeInput = within(
                screen.getByTestId(`attribute-${attributes[0].id}`)
            ).getByRole('textbox') as HTMLInputElement
            await userEvent.type(attributeInput, anAttribute)

            await uiActions.submitForm(screen)
            expect(createMock).toHaveBeenCalledTimes(1)
            expect(createMock).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        id: undefined,
                        name: aName,
                        shortName: aShortName,
                        code: aCode,
                        description: aDescription,
                        url: aUrl,
                        indicatorType: expect.objectContaining({
                            id: indicatorTypes[0].id,
                        }),
                        decimals: 1,
                        annualized: true,
                        numerator: aNumerator,
                        denominator: aDenominator,
                        numeratorDescription: aNumeratorDescription,
                        denominatorDescription: aDenominatorDescription,
                        aggregateExportCategoryOptionCombo: aCatOptionExport,
                        aggregateExportAttributeOptionCombo: anAttOptionExport,
                        legendSets: [
                            expect.objectContaining({ id: legendSets[0].id }),
                        ],
                        attributeValues: [
                            {
                                attribute: expect.objectContaining({
                                    id: attributes[0].id,
                                }),
                                value: anAttribute,
                            },
                        ],
                    }),
                })
            )
        })
    })

    describe('Edit', () => {
        const renderForm = generateRenderer(
            { section, mockSchema },
            (
                routeOptions,
                {
                    customTestData = {},
                    indicatorOverwrites = {},
                    matchingExistingElementFilter = undefined,
                    id = randomDhis2Id(),
                } = {}
            ) => {
                const indicatorType = testIndicatorType()
                const indicatorTypes = [
                    indicatorType,
                    testIndicatorType(),
                    testIndicatorType(),
                ]
                const attributes = [testCustomAttribute()]
                const legendSets = [testLegendSet(), testLegendSet()]
                const indicator = testIndicator({
                    id,
                    indicatorType,
                    legendSets: [legendSets[0]],
                    attributeValues: [
                        { attribute: attributes[0], value: 'attribute value' },
                    ],
                    ...indicatorOverwrites,
                })
                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}/:id`}
                        initialEntries={[`/${section.namePlural}/${id}`]}
                        customData={{
                            attributes: () => ({ attributes }),
                            indicatorTypes: () => ({ indicatorTypes }),
                            legendSets: () => ({
                                legendSets,
                                pager: {
                                    page: 1,
                                    total: 2,
                                    pageSize: 20,
                                    pageCount: 1,
                                },
                            }),
                            indicators: (type: any, params: any) => {
                                if (type === 'json-patch') {
                                    updateMock(params)
                                    return { statusCode: 204 }
                                }
                                if (type === 'read') {
                                    if (params?.id) {
                                        return indicator
                                    }
                                    if (
                                        params?.params?.filter?.includes(
                                            matchingExistingElementFilter
                                        )
                                    ) {
                                        return {
                                            pager: { total: 1 },
                                            indicators: [testIndicator()],
                                        }
                                    }
                                    return {
                                        pager: { total: 0 },
                                        indicators: [],
                                    }
                                }
                            },
                            'indicators/expression/description': () => ({
                                status: 'OK',
                            }),
                            ...customTestData,
                        }}
                        routeOptions={routeOptions}
                    >
                        <Edit />
                    </TestComponentWithRouter>
                )
                return {
                    screen,
                    attributes,
                    indicatorTypes,
                    legendSets,
                    indicator,
                }
            }
        )

        it('contain all needed field prefilled', async () => {
            const {
                screen,
                indicator,
                indicatorTypes,
                legendSets,
                attributes,
            } = await renderForm()

            uiAssertions.expectNameFieldExist(indicator.name, screen)
            uiAssertions.expectInputFieldToExist(
                'shortName',
                indicator.shortName,
                screen
            )
            uiAssertions.expectCodeFieldExist(indicator.code, screen)
            uiAssertions.expectTextAreaFieldToExist(
                'description',
                indicator.description,
                screen
            )
            uiAssertions.expectInputFieldToExist('url', indicator.url, screen)
            uiAssertions.expectColorAndIconFieldToExist(screen)

            await uiAssertions.expectSelectToExistWithOptions(
                screen.getByTestId('formfields-indicatortype'),
                {
                    selected: indicator.indicatorType.displayName,
                    options: indicatorTypes,
                },
                screen
            )

            const expectedDecimalsOptions = [
                { displayName: '<No value>' },
                { displayName: '0' },
                { displayName: '1' },
                { displayName: '2' },
                { displayName: '3' },
                { displayName: '4' },
                { displayName: '5' },
            ]
            await uiAssertions.expectSelectToExistWithOptions(
                screen.getByTestId('decimals-field'),
                {
                    selected: indicator.decimals?.toString(),
                    options: expectedDecimalsOptions,
                },
                screen
            )

            uiAssertions.expectCheckboxFieldToExist(
                'annualized',
                indicator.annualized,
                screen
            )

            uiAssertions.expectTextAreaFieldToExist(
                'numerator',
                indicator.numerator,
                screen
            )
            uiAssertions.expectTextAreaFieldToExist(
                'denominator',
                indicator.denominator,
                screen
            )
            uiAssertions.expectTextAreaFieldToExist(
                'numeratorDescription',
                indicator.numeratorDescription,
                screen
            )
            uiAssertions.expectTextAreaFieldToExist(
                'denominatorDescription',
                indicator.denominatorDescription,
                screen
            )

            uiAssertions.expectInputFieldToExist(
                'aggregateExportCategoryOptionCombo',
                indicator.aggregateExportCategoryOptionCombo,
                screen
            )
            uiAssertions.expectInputFieldToExist(
                'aggregateExportAttributeOptionCombo',
                indicator.aggregateExportAttributeOptionCombo,
                screen
            )

            await uiAssertions.expectTransferFieldToExistWithOptions(
                'legendSets-field',
                { lhs: [legendSets[1]], rhs: [legendSets[0]] },
                screen
            )

            attributes.forEach((attribute: { id: string }) => {
                const attributeInput = screen.getByTestId(
                    `attribute-${attribute.id}`
                )
                expect(attributeInput).toBeVisible()
                expect(
                    within(
                        within(attributeInput).getByTestId('dhis2-uicore-input')
                    ).getByRole('textbox')
                ).toHaveValue(indicator.attributeValues[0].value)
            })
        })

        it('should submit the data and return to the list view on success when a field is changed', async () => {
            const { screen, indicator } = await renderForm()
            const newName = faker.internet.userName()

            await uiActions.enterName(newName, screen)

            await uiActions.submitForm(screen)

            expect(updateMock).toHaveBeenCalledWith({
                data: [
                    {
                        op: 'replace',
                        path: '/name',
                        value: newName,
                    },
                ],
                id: indicator.id,
                params: undefined,
                resource: 'indicators',
            })
        })

        it('should do nothing and return to the list view on success when no field is changed', async () => {
            const { screen } = await renderForm()
            await uiActions.submitForm(screen)
            expect(updateMock).not.toHaveBeenCalled()
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

        it('update decimals to 0', async () => {
            const { screen, indicator } = await renderForm()
            await uiActions.pickOptionFromSelect(
                screen.getByTestId('decimals-field'),
                1,
                screen
            )
            await uiActions.submitForm(screen)
            expect(updateMock).toHaveBeenCalledWith({
                data: [{ op: 'replace', path: '/decimals', value: 0 }],
                id: indicator.id,
                params: undefined,
                resource: 'indicators',
            })
        })

        it('displays 0 decimals correctly', async () => {
            const { screen } = await renderForm({
                indicatorOverwrites: { decimals: 0 },
            })
            const decimals = within(
                screen.getByTestId('decimals-field')
            ).getByTestId('dhis2-uicore-select-input')
            expect(decimals).toBeVisible()
            expect(decimals).toHaveTextContent('0')
        })
    })
})
