import { faker } from '@faker-js/faker'
import { render, RenderResult, waitFor, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
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
} from '../../testUtils/builders'
import { generateRenderer } from '../../testUtils/generateRenderer'
import TestComponentWithRouter from '../../testUtils/TestComponentWithRouter'
import { uiActions } from '../../testUtils/uiActions'
import { uiAssertions } from '../../testUtils/uiAssertions'
import { Program, ProgramTrackedEntityAttribute } from '../../types/generated'
import { staticOptions } from './form/OrgUnitField'
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
        (
            routeOptions,
            {
                customTestData = {},
                matchingExistingElementFilter = undefined,
            } = {}
        ) => {
            const attributes = [testCustomAttribute()]
            const programs = [testProgram(), testProgram(), testProgram()]
            const legendSets = [testLegendSets(), testLegendSets()]
            const screen = render(
                <TestComponentWithRouter
                    path={`/${section.namePlural}`}
                    customData={{
                        attributes: () => ({ attributes }),
                        programs: () => ({ programs }),
                        legendSets: () => ({
                            legendSets,
                            pager: {
                                page: 1,
                                total: 2,
                                pageSize: 20,
                                pageCount: 1,
                            },
                        }),
                        programIndicators: (type: any, params: any) => {
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
                                        programIndicators: [
                                            testProgramIndicator(),
                                        ],
                                    }
                                }
                                return {
                                    pager: { total: 0 },
                                    programIndicators: [],
                                }
                            }
                        },
                        ...customTestData,
                    }}
                    routeOptions={routeOptions}
                >
                    <ComponentToTest />
                </TestComponentWithRouter>
            )
            return { screen, attributes, programs, legendSets }
        }
    )

    const addPeriodBoundary = async (
        {
            target,
            customText,
            type,
            offset,
            periodType,
        }: {
            target?: number
            customText?: string
            type?: number
            offset?: number
            periodType?: number
        },
        availablePeriodTypes = 1,
        screen: RenderResult
    ) => {
        const addPeriodBoundaryButton = screen.getByTestId(
            'add-boundary-button'
        )
        expect(addPeriodBoundaryButton).toBeVisible()
        await userEvent.click(addPeriodBoundaryButton)
        const periodBoundaryModal = await screen.findByTestId(
            'analytics-period-boundary-modal'
        )
        expect(periodBoundaryModal).toBeVisible()
        if (target !== undefined) {
            const targets = await uiActions.openSingleSelect(
                within(periodBoundaryModal).getByTestId('apb-target-select'),
                screen
            )
            expect(targets).toHaveLength(4)
            await userEvent.click(targets[target])
        }
        if (customText !== undefined) {
            const customTextInput = within(
                within(periodBoundaryModal).getByTestId(
                    'apb-custom-target-text-content'
                )
            ).getByRole('textbox')
            await userEvent.type(customTextInput, customText)
        }
        if (type !== undefined) {
            const types = await uiActions.openSingleSelect(
                within(periodBoundaryModal).getByTestId('apb-type-select'),
                screen
            )
            expect(types).toHaveLength(5)
            await userEvent.click(types[type])
        }
        if (offset !== undefined) {
            const offsetInput = within(
                within(periodBoundaryModal).getByTestId('apb-offset-input')
            ).getByRole('spinbutton')
            await userEvent.type(offsetInput, offset.toString())
        }
        if (periodType !== undefined) {
            const periodTypes = await uiActions.openSingleSelect(
                within(periodBoundaryModal).getByTestId(
                    'apb-period-type-select'
                ),
                screen
            )
            expect(periodTypes).toHaveLength(availablePeriodTypes + 1)
            await userEvent.click(periodTypes[periodType])
        }
        await userEvent.click(
            within(periodBoundaryModal).getByTestId('save-apb-button')
        )
    }

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
        await uiAssertions.expectSelectToExistWithOptions(
            screen.getByTestId('programs-field'),
            { options: programs },
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
        await uiAssertions.expectSelectToExistWithOptions(
            screen.getByTestId('decimals-field'),
            { options: expectedDecimalsOptions },
            screen
        )
        await uiAssertions.expectSelectToExistWithOptions(
            screen.getByTestId('aggregation-type-field'),
            {
                options: mockSchema.properties.aggregationType.constants.map(
                    (o) => ({
                        displayName: getConstantTranslation(o),
                    })
                ),
            },
            screen
        )
        await uiAssertions.expectSelectToExistWithOptions(
            screen.getByTestId('analytics-type-field'),
            {
                options: mockSchema.properties.analyticsType.constants.map(
                    (o) => ({
                        displayName: getConstantTranslation(o),
                    })
                ),
            },
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
        // uiAssertions.expectInputFieldToExist(
        //     'aggregateExportDataElement',
        //     '',
        //     screen
        // )
        expect(screen.getByTestId('add-boundary-button')).toBeVisible()
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
    it('should show the org unit field when there is a program selected with type WITH_REGISTRATION and analytics type is event', async () => {
        const programTrackedEntityAttributes = [
            {
                trackedEntityAttribute: {
                    valueType: 'ORGANISATION_UNIT',
                    displayName: 'entity attribute org unit',
                    id: randomDhis2Id(),
                },
            },
            {
                trackedEntityAttribute: {
                    valueType: 'TEXT',
                    displayName: 'other entity attribute',
                    id: randomDhis2Id(),
                },
            },
        ] as unknown as ProgramTrackedEntityAttribute[]
        const programWithRegistration = testProgram({
            programType: 'WITH_REGISTRATION' as Program.programType,
            programTrackedEntityAttributes,
        })
        const programStageDataElements = [
            {
                dataElement: {
                    valueType: 'BOOLEAN',
                    displayName: 'boolean data element',
                    id: randomDhis2Id(),
                },
            },
            {
                dataElement: {
                    valueType: 'ORGANISATION_UNIT',
                    displayName: 'org unit data element',
                    id: randomDhis2Id(),
                },
            },
        ]
        const { screen } = await renderForm({
            customTestData: {
                programs: (type: any, params: any) => {
                    if (params.id === programWithRegistration.id) {
                        return {
                            programStages: [
                                {
                                    programStageDataElements,
                                    id: randomDhis2Id(),
                                },
                            ],
                        }
                    }
                    return Promise.resolve({
                        programs: [programWithRegistration, testProgram()],
                    })
                },
            },
        })

        const programOptions = await uiActions.openSingleSelect(
            screen.getByTestId('programs-field'),
            screen
        )
        await userEvent.click(programOptions[0])

        const analyticsOptions = await uiActions.openSingleSelect(
            screen.getByTestId('analytics-type-field'),
            screen
        )
        await userEvent.click(analyticsOptions[0])

        const orgUnitField = await screen.findByTestId('org-unit-field')
        await uiAssertions.expectSelectToExistWithOptions(
            orgUnitField,
            {
                options: [
                    { displayName: staticOptions.eventDefault.label },
                    programTrackedEntityAttributes[0].trackedEntityAttribute,
                    programStageDataElements[1].dataElement,
                    { displayName: staticOptions.registration.label },
                    { displayName: staticOptions.enrollment.label },
                    { displayName: staticOptions.ownerAtStart.label },
                    { displayName: staticOptions.ownerAtEnd.label },
                ],
            },
            screen
        )
    })
    it('should show the org unit field when there is a program selected with type WITH_REGISTRATION and analytics type is enrollment', async () => {
        const programTrackedEntityAttributes = [
            {
                trackedEntityAttribute: {
                    valueType: 'ORGANISATION_UNIT',
                    displayName: 'entity attribute org unit',
                    id: randomDhis2Id(),
                },
            },
            {
                trackedEntityAttribute: {
                    valueType: 'TEXT',
                    displayName: 'other entity attribute',
                    id: randomDhis2Id(),
                },
            },
        ] as unknown as ProgramTrackedEntityAttribute[]
        const programWithRegistration = testProgram({
            programType: 'WITH_REGISTRATION' as Program.programType,
            programTrackedEntityAttributes,
        })
        const programStageDataElements = [
            {
                dataElement: {
                    valueType: 'BOOLEAN',
                    displayName: 'boolean data element',
                    id: randomDhis2Id(),
                },
            },
            {
                dataElement: {
                    valueType: 'ORGANISATION_UNIT',
                    displayName: 'org unit data element',
                    id: randomDhis2Id(),
                },
            },
        ]
        const { screen } = await renderForm({
            customTestData: {
                programs: (type: any, params: any) => {
                    if (params.id === programWithRegistration.id) {
                        return {
                            programStages: [
                                {
                                    programStageDataElements,
                                    id: randomDhis2Id(),
                                },
                            ],
                        }
                    }
                    return Promise.resolve({
                        programs: [programWithRegistration, testProgram()],
                    })
                },
            },
        })

        const programOptions = await uiActions.openSingleSelect(
            screen.getByTestId('programs-field'),
            screen
        )
        await userEvent.click(programOptions[0])

        const analyticsOptions = await uiActions.openSingleSelect(
            screen.getByTestId('analytics-type-field'),
            screen
        )
        await userEvent.click(analyticsOptions[1])

        const orgUnitField = await screen.findByTestId('org-unit-field')
        await uiAssertions.expectSelectToExistWithOptions(
            orgUnitField,
            {
                options: [
                    { displayName: staticOptions.enrollmentDefault.label },
                    programTrackedEntityAttributes[0].trackedEntityAttribute,
                    { displayName: staticOptions.registration.label },
                    { displayName: staticOptions.ownerAtStart.label },
                    { displayName: staticOptions.ownerAtEnd.label },
                ],
            },
            screen
        )
    })
    it('should show the org unit field when there is a program selected with type WITHOUT_REGISTRATION', async () => {
        const programWithoutRegistration = testProgram({
            programType: 'WITHOUT_REGISTRATION' as Program.programType,
        })
        const programStageDataElements = [
            {
                dataElement: {
                    valueType: 'BOOLEAN',
                    displayName: 'boolean data element',
                    id: randomDhis2Id(),
                },
            },
            {
                dataElement: {
                    valueType: 'ORGANISATION_UNIT',
                    displayName: 'org unit data element',
                    id: randomDhis2Id(),
                },
            },
        ]
        const { screen } = await renderForm({
            customTestData: {
                programs: (type: any, params: any) => {
                    if (params.id === programWithoutRegistration.id) {
                        return {
                            programStages: [
                                {
                                    programStageDataElements,
                                    id: randomDhis2Id(),
                                },
                            ],
                        }
                    }
                    return Promise.resolve({
                        programs: [programWithoutRegistration, testProgram()],
                    })
                },
            },
        })

        const programOptions = await uiActions.openSingleSelect(
            screen.getByTestId('programs-field'),
            screen
        )
        expect(programOptions).toHaveLength(2)
        await userEvent.click(programOptions[0])

        const orgUnitField = await screen.findByTestId('org-unit-field')
        await uiAssertions.expectSelectToExistWithOptions(
            orgUnitField,
            {
                options: [
                    { displayName: staticOptions.eventDefault.label },
                    programStageDataElements[1].dataElement,
                ],
            },
            screen
        )
    })
    it('should not show the org unit field when no program is selected', async () => {
        const { screen } = await renderForm()

        await waitFor(() => {
            expect(
                screen.queryByTestId('org-unit-field')
            ).not.toBeInTheDocument()
        })
    })
    it('should not show the org unit field when there is a program selected with type WITH_REGISTRATION but no analytics type is selected', async () => {
        const programWithRegistration = testProgram({
            programType: 'WITH_REGISTRATION' as Program.programType,
        })
        const { screen } = await renderForm({
            customTestData: {
                programs: (type: any, params: any) => {
                    return Promise.resolve({
                        programs: [programWithRegistration, testProgram()],
                    })
                },
            },
        })
        const programOptions = await uiActions.openSingleSelect(
            screen.getByTestId('programs-field'),
            screen
        )
        await userEvent.click(programOptions[0])

        await waitFor(() => {
            expect(
                screen.queryByTestId('org-unit-field')
            ).not.toBeInTheDocument()
        })
    })
    it('should add  and delete period boundaries', async () => {
        const periodTypes = ['Daily', 'Monthly', 'Yearly']
        const { screen } = await renderForm({
            customTestData: {
                periodTypes: () => ({
                    periodTypes: periodTypes.map((pt) => ({ name: pt })),
                }),
            },
        })
        await addPeriodBoundary(
            { target: 0, periodType: 1, type: 1, offset: 5 },
            periodTypes.length,
            screen
        )
        const boundariesList = screen.getAllByTestId(
            'analytics-period-boundary'
        )
        expect(boundariesList).toHaveLength(1)

        const customText = 'lalala'
        await addPeriodBoundary(
            { target: 3, customText, periodType: 1, type: 1, offset: 5 },
            periodTypes.length,
            screen
        )
        const newBoundariesList = screen.getAllByTestId(
            'analytics-period-boundary'
        )
        expect(newBoundariesList).toHaveLength(2)

        await userEvent.click(
            within(newBoundariesList[1]).getByTestId('apb-remove-button')
        )
        const newBoundariesList2 = screen.getAllByTestId(
            'analytics-period-boundary'
        )
        expect(newBoundariesList2).toHaveLength(1)
    })
    it('should have a cancel button with a link back to the list view', async () => {
        const { screen } = await renderForm()
        const cancelButton = screen.getByTestId('form-cancel-link')
        expect(cancelButton).toBeVisible()
        expect(cancelButton).toHaveAttribute('href', `/${section.namePlural}`)
    })
    it('should not submit when required values are missing', async () => {
        const { screen } = await renderForm()
        await uiActions.submitForm(screen)
        expect(createMock).not.toHaveBeenCalled()
        uiAssertions.expectFieldToHaveError(
            'programs-field',
            'Required',
            screen
        )
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
    it('should submit the data', async () => {
        const programWithoutRegistration = testProgram({
            programType: 'WITHOUT_REGISTRATION' as Program.programType,
        })
        const aName = faker.internet.userName()
        const aShortName = faker.internet.userName()
        const aCode = faker.science.chemicalElement().symbol
        const aDescription = faker.company.buzzPhrase()
        const aCatOptionExport = faker.internet.userName()
        const anAttOptionExport = faker.internet.userName()
        // const anAggDataExport = faker.internet.userName()
        const anAttribute = faker.internet.userName()
        const anExpression = faker.finance.routingNumber()
        const aFilter = faker.finance.routingNumber()

        const periodTypes = ['Daily', 'Monthly', 'Yearly']
        const { screen, legendSets, attributes } = await renderForm({
            customTestData: {
                programs: (type: any, params: any) => {
                    if (params.id === programWithoutRegistration.id) {
                        return {
                            programStages: [],
                        }
                    }
                    return Promise.resolve({
                        programs: [programWithoutRegistration, testProgram()],
                    })
                },
                periodTypes: () => ({
                    periodTypes: periodTypes.map((pt) => ({ name: pt })),
                }),
            },
        })

        const programOptions = await uiActions.openSingleSelect(
            screen.getByTestId('programs-field'),
            screen
        )
        await userEvent.click(programOptions[0])
        await uiActions.enterName(aName, screen)
        await uiActions.enterInputFieldValue('shortName', aShortName, screen)
        await uiActions.enterCode(aCode, screen)
        // await uiActions.pickColor(screen)
        await uiActions.enterInputFieldValue(
            'description',
            aDescription,
            screen
        )
        const decimalsOptions = await uiActions.openSingleSelect(
            screen.getByTestId('decimals-field'),
            screen
        )
        await userEvent.click(decimalsOptions[2])

        const aggregationTypeOptions = await uiActions.openSingleSelect(
            screen.getByTestId('aggregation-type-field'),
            screen
        )
        await userEvent.click(aggregationTypeOptions[0])

        const analyticsOptions = await uiActions.openSingleSelect(
            screen.getByTestId('analytics-type-field'),
            screen
        )
        await userEvent.click(analyticsOptions[0])

        const orgUnitOptions = await uiActions.openSingleSelect(
            screen.getByTestId('org-unit-field'),
            screen
        )
        await userEvent.click(orgUnitOptions[0])

        await addPeriodBoundary(
            { target: 0, periodType: 1, type: 1, offset: 5 },
            periodTypes.length,
            screen
        )

        await uiActions.clickOnCheckboxField('displayInForm', screen)
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
        // await uiActions.enterInputFieldValue(
        //     'aggregateExportDataElement',
        //     anAggDataExport,
        //     screen
        // )
        await uiActions.pickOptionInTransfer(
            'legendSets-field',
            legendSets[0].displayName,
            screen
        )
        const attributeInput = within(
            screen.getByTestId(`attribute-${attributes[0].id}`)
        ).getByRole('textbox') as HTMLInputElement
        await userEvent.type(attributeInput, anAttribute)
        await uiActions.enterInputFieldValue(`expression`, anExpression, screen)
        await uiActions.enterInputFieldValue(`filter`, aFilter, screen)
        await uiActions.submitForm(screen)
        expect(createMock).toHaveBeenCalledTimes(1)
        expect(createMock).toHaveBeenLastCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    id: undefined,
                    program: expect.objectContaining({
                        id: programWithoutRegistration.id,
                    }),
                    name: aName,
                    shortName: aShortName,
                    code: aCode,
                    description: aDescription,
                    decimals: 1,
                    aggregationType: 'SUM',
                    analyticsType: 'EVENT',
                    displayInForm: true,
                    aggregateExportAttributeOptionCombo: anAttOptionExport,
                    aggregateExportCategoryOptionCombo: aCatOptionExport,
                    // aggregateExportDataElement: anAggDataExport,
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
                    expression: anExpression,
                    filter: aFilter,
                    style: { color: undefined, icon: undefined },
                    analyticsPeriodBoundaries: [
                        {
                            boundaryTarget: 'INCIDENT_DATE',
                            analyticsPeriodBoundaryType:
                                'BEFORE_START_OF_REPORTING_PERIOD',
                            offsetPeriodType: periodTypes[0],
                            offsetPeriods: 5,
                        },
                    ],
                    orgUnitField: staticOptions.eventDefault.value,
                }),
            })
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
