import { faker } from '@faker-js/faker'
import { render, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import schemaMock from '../../__mocks__/schema/programRuleVariablesSchema.json'
import { FOOTER_ID } from '../../app/layout/Layout'
import { getConstantTranslation, SECTIONS_MAP } from '../../lib'
import {
    randomLongString,
    testDataElement,
    testProgram,
    testProgramRuleVariable,
    testProgramStage,
    testTrackedEntityAttribute,
} from '../../testUtils/builders'
import { generateRenderer } from '../../testUtils/generateRenderer'
import TestComponentWithRouter from '../../testUtils/TestComponentWithRouter'
import { uiActions } from '../../testUtils/uiActions'
import { uiAssertions } from '../../testUtils/uiAssertions'
import { ProgramRuleVariable } from '../../types/generated'
import { Component as Edit } from './Edit'
import { Component as New } from './New'
import resetAllMocks = jest.resetAllMocks

const section = SECTIONS_MAP.programRuleVariable
const mockSchema = schemaMock
jest.mock('use-debounce', () => ({
    useDebouncedCallback: (fn: any) => fn,
}))

const pickSourceType = async (
    sourceType: ProgramRuleVariable.programRuleVariableSourceType,
    screen: ReturnType<typeof render>
) => {
    const radioButton = screen.getByLabelText(
        getConstantTranslation(sourceType)
    )
    await userEvent.click(radioButton)
}

describe('Program rule variables form tests', () => {
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
                { matchingExistingElementFilter = undefined } = {}
            ) => {
                const dataElements = [testDataElement(), testDataElement()]
                const trackedEntityAttributes = [
                    testTrackedEntityAttribute(),
                    testTrackedEntityAttribute(),
                ]
                const programStages = [testProgramStage(), testProgramStage()]
                const programs = [testProgram(), testProgram()]
                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}`}
                        customData={{
                            programs: () => ({ programs }),
                            programStages: () => ({ programStages }),
                            dataElements: () => ({ dataElements }),
                            trackedEntityAttributes: () => ({
                                trackedEntityAttributes,
                            }),
                            programRuleVariables: (type: any, params: any) => {
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
                                            programRuleVariables: [
                                                testProgramRuleVariable(),
                                            ],
                                        }
                                    }
                                    return {
                                        pager: { total: 0 },
                                        programRuleVariables: [],
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
                    programs,
                    dataElements,
                    trackedEntityAttributes,
                }
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
                'program-field',
                'Required',
                screen
            )
            const sourceTypeField = screen.getByTestId('sourceType-field')
            expect(sourceTypeField).toBeVisible()
            const requiredText = within(sourceTypeField).getByText('Required')
            expect(requiredText).toBeVisible()
        })

        it('should show an error if name field is too long', async () => {
            const { screen } = await renderForm()
            const longText = randomLongString(231)
            await uiActions.enterName(longText, screen)
            await uiAssertions.expectNameToErrorWhenExceedsLength(screen)
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
        })

        it('should show an error if name field contains forbidden words', async () => {
            const { screen } = await renderForm()
            const nameWithForbiddenWord = `test and value`
            await uiActions.enterName(nameWithForbiddenWord, screen)
            await waitFor(() => {
                uiAssertions.expectFieldToHaveError(
                    'formfields-name',
                    'Program rule variable name contains forbidden words: and, or, not.',
                    screen
                )
            })
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
        })

        it('should show an error if name field contains invalid characters', async () => {
            const { screen } = await renderForm()
            const nameWithInvalidChars = `test@value#123`
            await uiActions.enterName(nameWithInvalidChars, screen)
            await waitFor(() => {
                uiAssertions.expectFieldToHaveError(
                    'formfields-name',
                    'Name can only contain letters, numbers, space, dash, dot and underscore',
                    screen
                )
            })
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
        })

        it('should show an error if name field is a duplicate', async () => {
            const existingName = faker.company.name()
            const { screen } = await renderForm({
                matchingExistingElementFilter: `name:ieq:${existingName}`,
            })
            await uiActions.enterName(existingName, screen)
            await userEvent.click(screen.getByTestId('formfields-name-label'))
            await waitFor(() => {
                const error = screen.getByTestId('formfields-name-validation')
                expect(error).toBeVisible()
                expect(error).toHaveTextContent(
                    'This name is already in use. Consider updating the name to avoid a duplication.'
                )
            })
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
        })
    })

    describe('New', () => {
        const renderForm = generateRenderer(
            { section, mockSchema },
            (routeOptions) => {
                const dataElements = [testDataElement(), testDataElement()]
                const trackedEntityAttributes = [
                    testTrackedEntityAttribute(),
                    testTrackedEntityAttribute(),
                ]
                const programStages = [testProgramStage(), testProgramStage()]
                const programs = [testProgram(), testProgram()]

                const programStagesWithDataElements = programStages.map(
                    (stage) => ({
                        id: stage.id,
                        programStageDataElements: dataElements.map((de) => ({
                            dataElement: {
                                id: de.id,
                                displayName: de.displayName || de.name,
                            },
                        })),
                    })
                )

                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}`}
                        customData={{
                            programs: (_: any, params: any) => {
                                if (params?.id !== undefined) {
                                    const programId = params.id
                                    const program = programs.find(
                                        (p) => p.id === programId
                                    )
                                    if (program) {
                                        return {
                                            programStages:
                                                programStagesWithDataElements,
                                        }
                                    }
                                    return {
                                        programStages: [],
                                    }
                                }
                                return { programs }
                            },
                            programStages: () => ({ programStages }),
                            dataElements: () => ({ dataElements }),
                            trackedEntityAttributes: () => ({
                                trackedEntityAttributes,
                            }),
                            programRuleVariables: (type: any, params: any) => {
                                if (type === 'create') {
                                    createMock(params)
                                    return { statusCode: 204 }
                                }
                                if (type === 'read') {
                                    return {
                                        pager: { total: 0 },
                                        programRuleVariables: [],
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
                    programs,
                    dataElements,
                    trackedEntityAttributes,
                }
            }
        )

        it('contains all needed fields', async () => {
            const { screen } = await renderForm()
            uiAssertions.expectNameFieldExist('', screen)
            expect(screen.getByTestId('program-field')).toBeVisible()
            expect(screen.getByTestId('sourceType-field')).toBeVisible()
            expect(
                screen.getByTestId('useCodeForOptionSet-field')
            ).toBeVisible()
        })

        it('should show program stage field when source type is DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE', async () => {
            const { screen } = await renderForm()

            const aName = faker.internet.userName()
            await uiActions.enterName(aName, screen)

            await uiActions.pickOptionFromSelect(
                screen.getByTestId('program-field'),
                1,
                screen
            )

            await pickSourceType(
                ProgramRuleVariable.programRuleVariableSourceType
                    .DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE,
                screen
            )

            await waitFor(() => {
                expect(screen.getByTestId('programStage-field')).toBeVisible()
            })

            expect(
                screen.queryByTestId('dataElement-field')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId('trackedEntityAttribute-field')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId('formfields-valueType')
            ).not.toBeInTheDocument()
        })

        it('should show data element field after selecting program stage when source type is DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE', async () => {
            const { screen } = await renderForm()

            const aName = faker.internet.userName()
            await uiActions.enterName(aName, screen)

            await uiActions.pickOptionFromSelect(
                screen.getByTestId('program-field'),
                1,
                screen
            )

            await pickSourceType(
                ProgramRuleVariable.programRuleVariableSourceType
                    .DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE,
                screen
            )

            await waitFor(() => {
                expect(screen.getByTestId('programStage-field')).toBeVisible()
            })

            await uiActions.pickOptionFromSelect(
                screen.getByTestId('programStage-field'),
                1,
                screen
            )

            await waitFor(() => {
                expect(screen.getByTestId('dataElement-field')).toBeVisible()
            })
        })

        it('should show data element field when source type is DATAELEMENT_NEWEST_EVENT_PROGRAM', async () => {
            const { screen } = await renderForm()

            const aName = faker.internet.userName()
            await uiActions.enterName(aName, screen)

            await uiActions.pickOptionFromSelect(
                screen.getByTestId('program-field'),
                1,
                screen
            )

            await pickSourceType(
                ProgramRuleVariable.programRuleVariableSourceType
                    .DATAELEMENT_NEWEST_EVENT_PROGRAM,
                screen
            )

            await waitFor(() => {
                expect(screen.getByTestId('dataElement-field')).toBeVisible()
            })

            expect(
                screen.queryByTestId('programStage-field')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId('trackedEntityAttribute-field')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId('formfields-valueType')
            ).not.toBeInTheDocument()
        })

        it('should show data element field when source type is DATAELEMENT_CURRENT_EVENT', async () => {
            const { screen } = await renderForm()

            const aName = faker.internet.userName()
            await uiActions.enterName(aName, screen)

            await uiActions.pickOptionFromSelect(
                screen.getByTestId('program-field'),
                1,
                screen
            )

            await pickSourceType(
                ProgramRuleVariable.programRuleVariableSourceType
                    .DATAELEMENT_CURRENT_EVENT,
                screen
            )

            await waitFor(() => {
                expect(screen.getByTestId('dataElement-field')).toBeVisible()
            })

            expect(
                screen.queryByTestId('programStage-field')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId('trackedEntityAttribute-field')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId('formfields-valueType')
            ).not.toBeInTheDocument()
        })

        it('should show data element field when source type is DATAELEMENT_PREVIOUS_EVENT', async () => {
            const { screen } = await renderForm()

            const aName = faker.internet.userName()
            await uiActions.enterName(aName, screen)

            await uiActions.pickOptionFromSelect(
                screen.getByTestId('program-field'),
                1,
                screen
            )

            await pickSourceType(
                ProgramRuleVariable.programRuleVariableSourceType
                    .DATAELEMENT_PREVIOUS_EVENT,
                screen
            )

            await waitFor(() => {
                expect(screen.getByTestId('dataElement-field')).toBeVisible()
            })

            expect(
                screen.queryByTestId('programStage-field')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId('trackedEntityAttribute-field')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId('formfields-valueType')
            ).not.toBeInTheDocument()
        })

        it('should show tracked entity attribute field when source type is TEI_ATTRIBUTE', async () => {
            const { screen } = await renderForm()

            const aName = faker.internet.userName()
            await uiActions.enterName(aName, screen)

            await uiActions.pickOptionFromSelect(
                screen.getByTestId('program-field'),
                1,
                screen
            )

            await pickSourceType(
                ProgramRuleVariable.programRuleVariableSourceType.TEI_ATTRIBUTE,
                screen
            )

            await waitFor(() => {
                expect(
                    screen.getByTestId('trackedEntityAttribute-field')
                ).toBeVisible()
            })

            expect(
                screen.queryByTestId('programStage-field')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId('dataElement-field')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId('formfields-valueType')
            ).not.toBeInTheDocument()
        })

        it('should show value type field when source type is CALCULATED_VALUE', async () => {
            const { screen } = await renderForm()

            const aName = faker.internet.userName()
            await uiActions.enterName(aName, screen)

            await uiActions.pickOptionFromSelect(
                screen.getByTestId('program-field'),
                1,
                screen
            )

            await pickSourceType(
                ProgramRuleVariable.programRuleVariableSourceType
                    .CALCULATED_VALUE,
                screen
            )

            await waitFor(() => {
                expect(screen.getByTestId('formfields-valueType')).toBeVisible()
            })

            expect(
                screen.queryByTestId('programStage-field')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId('dataElement-field')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId('trackedEntityAttribute-field')
            ).not.toBeInTheDocument()
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

        it('should submit the basic information', async () => {
            const { screen } = await renderForm()
            const aName = faker.internet.userName()

            await uiActions.enterName(aName, screen)
            await uiActions.pickOptionFromSelect(
                screen.getByTestId('program-field'),
                1,
                screen
            )
            await pickSourceType(
                ProgramRuleVariable.programRuleVariableSourceType
                    .DATAELEMENT_CURRENT_EVENT,
                screen
            )

            await waitFor(() => {
                expect(screen.getByTestId('dataElement-field')).toBeVisible()
            })

            await uiActions.pickOptionFromSelect(
                screen.getByTestId('dataElement-field'),
                1,
                screen
            )

            await uiActions.submitForm(screen)

            expect(createMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        name: aName,
                        program: expect.objectContaining({
                            id: expect.any(String),
                        }),
                        programRuleVariableSourceType:
                            ProgramRuleVariable.programRuleVariableSourceType
                                .DATAELEMENT_CURRENT_EVENT,
                        dataElement: expect.objectContaining({
                            id: expect.any(String),
                        }),
                    }),
                })
            )
        })

        it('should submit with useCodeForOptionSet checked', async () => {
            const { screen } = await renderForm()
            const aName = faker.internet.userName()

            await uiActions.enterName(aName, screen)
            await uiActions.pickOptionFromSelect(
                screen.getByTestId('program-field'),
                1,
                screen
            )
            await pickSourceType(
                ProgramRuleVariable.programRuleVariableSourceType
                    .DATAELEMENT_CURRENT_EVENT,
                screen
            )
            await uiActions.pickOptionFromSelect(
                screen.getByTestId('dataElement-field'),
                1,
                screen
            )
            const useCodeField = screen.getByTestId('useCodeForOptionSet-field')
            const checkbox = within(useCodeField).getByRole('checkbox')
            await userEvent.click(checkbox)

            await uiActions.submitForm(screen)

            expect(createMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        name: aName,
                        useCodeForOptionSet: true,
                    }),
                })
            )
        })
    })

    describe('Edit', () => {
        const renderForm = generateRenderer(
            { section, mockSchema },
            (routeOptions) => {
                const programs = [testProgram(), testProgram()]
                const dataElements = [testDataElement(), testDataElement()]
                const trackedEntityAttributes = [
                    testTrackedEntityAttribute(),
                    testTrackedEntityAttribute(),
                ]
                const programStages = [testProgramStage(), testProgramStage()]
                const programRuleVariable = testProgramRuleVariable({
                    program: programs[0],
                    programRuleVariableSourceType:
                        ProgramRuleVariable.programRuleVariableSourceType
                            .DATAELEMENT_CURRENT_EVENT,
                    dataElement: dataElements[0],
                    useCodeForOptionSet: true,
                })

                const id = programRuleVariable.id

                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}/:id`}
                        initialEntries={[`/${section.namePlural}/${id}`]}
                        customData={{
                            programs: () => ({ programs }),
                            programStages: () => ({ programStages }),
                            dataElements: () => ({ dataElements }),
                            trackedEntityAttributes: () => ({
                                trackedEntityAttributes,
                            }),
                            programRuleVariables: (type: any, params: any) => {
                                if (type === 'json-patch') {
                                    updateMock(params)
                                    return { statusCode: 204 }
                                }
                                if (type === 'read') {
                                    if (params?.id) {
                                        return programRuleVariable
                                    }
                                    return {
                                        pager: { total: 0 },
                                        programRuleVariables: [],
                                    }
                                }
                            },
                        }}
                        routeOptions={routeOptions}
                    >
                        <Edit />
                    </TestComponentWithRouter>
                )
                return {
                    screen,
                    programs,
                    dataElements,
                    trackedEntityAttributes,
                    programRuleVariable,
                }
            }
        )

        it('contains the basic information field prefilled', async () => {
            const { screen, programRuleVariable } = await renderForm()

            await waitFor(() => {
                uiAssertions.expectNameFieldExist(
                    programRuleVariable.name,
                    screen
                )
            })

            const useCodeField = screen.getByTestId('useCodeForOptionSet-field')
            expect(useCodeField).toBeVisible()
            const checkbox = within(useCodeField).getByRole(
                'checkbox'
            ) as HTMLInputElement
            expect(checkbox).toHaveAttribute('name', 'useCodeForOptionSet')
            expect(checkbox).toBeChecked()
        })

        it('should have program field disabled in edit mode', async () => {
            const { screen } = await renderForm()

            await waitFor(() => {
                const programSelectInput = within(
                    screen.getByTestId('program-field')
                ).getByTestId('dhis2-uicore-select-input')
                expect(programSelectInput).toHaveClass('disabled')
            })
        })

        it('should have a cancel button with a link back to the list view', async () => {
            const { screen } = await renderForm()
            await waitFor(() => {
                const cancelButton = screen.getByTestId('form-cancel-link')
                expect(cancelButton).toBeVisible()
                expect(cancelButton).toHaveAttribute(
                    'href',
                    `/${section.namePlural}`
                )
            })
        })

        it('should do nothing and return to the list view on success when no field is changed', async () => {
            const { screen } = await renderForm()
            await waitFor(async () => {
                await uiActions.submitForm(screen)
                expect(updateMock).not.toHaveBeenCalled()
            })
        })

        it('should submit when fields are changed', async () => {
            const { screen } = await renderForm()
            const newName = faker.internet.userName()

            await waitFor(async () => {
                await uiActions.enterName(newName, screen)
                await uiActions.submitForm(screen)

                expect(updateMock).toHaveBeenCalledWith(
                    expect.objectContaining({
                        data: expect.arrayContaining([
                            expect.objectContaining({
                                path: '/name',
                                value: newName,
                            }),
                        ]),
                    })
                )
            })
        })
    })
})
