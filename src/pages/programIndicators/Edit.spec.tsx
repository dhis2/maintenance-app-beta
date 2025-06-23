import { render, within } from '@testing-library/react'
import React from 'react'
import { undefined } from 'zod'
import schemaMock from '../../__mocks__/schema/programIndicatorsSchema.json'
import { FOOTER_ID } from '../../app/layout/Layout'
import { getConstantTranslation, SECTIONS_MAP } from '../../lib'
import {
    randomDhis2Id,
    testCustomAttribute,
    testLegendSets,
    testProgram,
    testProgramIndicator,
} from '../../testUtils/builders'
import { generateRenderer } from '../../testUtils/generateRenderer'
import TestComponentWithRouter from '../../testUtils/TestComponentWithRouter'
import { uiActions } from '../../testUtils/uiActions'
import { uiAssertions } from '../../testUtils/uiAssertions'
import { Program } from '../../types/generated'
import { Component } from './Edit'
import { staticOptions } from './form/OrgUnitField'
import resetAllMocks = jest.resetAllMocks

const section = SECTIONS_MAP.programIndicator
const mockSchema = schemaMock
const ComponentToTest = Component
jest.mock('use-debounce', () => ({
    useDebouncedCallback: (fn: any) => fn,
}))

describe('Program indicator edit form tests', () => {
    const updateMock = jest.fn()
    const renderForm = generateRenderer(
        { section, mockSchema },
        (
            routeOptions,
            {
                customTestData = {},
                matchingExistingElementFilter = undefined,
                id = randomDhis2Id(),
            } = {}
        ) => {
            const programWithoutRegistration = testProgram({
                programType: 'WITHOUT_REGISTRATION' as Program.programType,
            })
            const programs = [
                programWithoutRegistration,
                testProgram(),
                testProgram(),
            ]
            const attributes = [testCustomAttribute()]
            const legendSets = [testLegendSets(), testLegendSets()]
            const programIndicator = testProgramIndicator({
                id,
                program: programWithoutRegistration,
                legendSets: [legendSets[0]],
                attributeValues: [
                    { attribute: attributes[0], value: 'attribute' },
                ],
                orgUnitField: staticOptions.eventDefault.id,
                style: { color: undefined, icon: undefined },
            })
            const screen = render(
                <TestComponentWithRouter
                    path={`/${section.namePlural}/:id`}
                    initialEntries={[`/${section.namePlural}/${id}`]}
                    customData={{
                        attributes: () => ({ attributes }),
                        programs: (_: any, params: any) => {
                            if (
                                params.params.filter[0] ===
                                `id:eq:${programWithoutRegistration.id}`
                            ) {
                                return {
                                    programs: [],
                                }
                            }
                            return Promise.resolve({
                                programs,
                            })
                        },
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
                                updateMock(params)
                                return { statusCode: 204 }
                            }
                            if (type === 'read') {
                                if (params?.id) {
                                    return programIndicator
                                }
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
            return {
                screen,
                attributes,
                programs,
                legendSets,
                programIndicator,
            }
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
        const { screen, programs, legendSets, attributes, programIndicator } =
            await renderForm()
        await uiAssertions.expectSelectToExistWithOptions(
            screen.getByTestId('programs-field'),
            {
                selected: programIndicator.program.displayName,
                options: programs,
                extraSelectedLengthToRemove: 1,
            },
            screen
        )
        uiAssertions.expectNameFieldExist(programIndicator.name, screen)
        uiAssertions.expectInputFieldToExist(
            'shortName',
            programIndicator.shortName,
            screen
        )
        uiAssertions.expectCodeFieldExist(programIndicator.code, screen)
        uiAssertions.expectColorAndIconFieldToExist(screen)
        uiAssertions.expectTextAreaFieldToExist(
            'description',
            programIndicator.description,
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
                selected: programIndicator.decimals,
                options: expectedDecimalsOptions,
            },
            screen
        )
        await uiAssertions.expectSelectToExistWithOptions(
            screen.getByTestId('aggregation-type-field'),
            {
                selected: getConstantTranslation(
                    programIndicator.aggregationType
                ),
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
                selected: getConstantTranslation(
                    programIndicator.analyticsType
                ),
                options: mockSchema.properties.analyticsType.constants.map(
                    (o) => ({
                        displayName: getConstantTranslation(o),
                    })
                ),
            },
            screen
        )
        await uiAssertions.expectSelectToExistWithOptions(
            screen.getByTestId('org-unit-field'),
            {
                selected: staticOptions.eventDefault.displayName,
                options: [staticOptions.eventDefault],
                extraSelectedLengthToRemove: 1,
            },
            screen
        )

        uiAssertions.expectCheckboxFieldToExist(
            'displayInForm',
            programIndicator.displayInForm,
            screen
        )
        uiAssertions.expectInputFieldToExist(
            'aggregateExportCategoryOptionCombo',
            programIndicator.aggregateExportCategoryOptionCombo,
            screen
        )
        uiAssertions.expectInputFieldToExist(
            'aggregateExportAttributeOptionCombo',
            programIndicator.aggregateExportAttributeOptionCombo,
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
            ).toHaveValue(programIndicator.attributeValues[0].value)
        })
    })
    it('should have a cancel button with a link back to the list view', async () => {
        const { screen } = await renderForm()
        const cancelButton = screen.getByTestId('form-cancel-link')
        expect(cancelButton).toBeVisible()
        expect(cancelButton).toHaveAttribute('href', `/${section.namePlural}`)
    })
    it('should not submit when required values are missing', async () => {
        const { screen } = await renderForm()
        await uiActions.clearInputField('name', screen)
        await uiActions.clearInputField('shortName', screen)
        await uiActions.submitForm(screen)
        expect(updateMock).not.toHaveBeenCalled()
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
    it('should do nothing and return to the list view on success when no field is changed', async () => {
        const { screen } = await renderForm()
        await uiActions.submitForm(screen)
        expect(updateMock).not.toHaveBeenCalled()
    })
})
