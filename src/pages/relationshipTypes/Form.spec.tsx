import { faker } from '@faker-js/faker'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import schemaMock from '../../__mocks__/schema/relationshipTypes.json'
import { FOOTER_ID } from '../../app/layout/Layout'
import { SECTIONS_MAP } from '../../lib'
import {
    randomDhis2Id,
    randomLongString,
    testCustomAttribute,
    testProgram,
    testTrackedEntityType,
} from '../../testUtils/builders'
import { generateRenderer } from '../../testUtils/generateRenderer'
import TestComponentWithRouter from '../../testUtils/TestComponentWithRouter'
import { uiActions } from '../../testUtils/uiActions'
import { uiAssertions } from '../../testUtils/uiAssertions'
import { Component as Edit } from './Edit'
import { Component as New } from './New'
import resetAllMocks = jest.resetAllMocks

const section = SECTIONS_MAP.relationshipType
const mockSchema = schemaMock

jest.mock('use-debounce', () => ({
    useDebouncedCallback: (fn: any) => fn,
}))

const testRelationshipType = (overwrites: Record<any, any> = {}) => ({
    id: randomDhis2Id(),
    name: faker.company.name(),
    code: faker.string.alphanumeric(6),
    description: faker.lorem.sentence(),
    bidirectional: false,
    fromToName: faker.lorem.words(3),
    toFromName: undefined,
    fromConstraint: {
        relationshipEntity: 'TRACKED_ENTITY_INSTANCE',
        trackedEntityType: undefined,
        program: undefined,
        programStage: undefined,
        trackerDataView: {
            attributes: [],
            dataElements: [],
        },
    },
    toConstraint: {
        relationshipEntity: 'TRACKED_ENTITY_INSTANCE',
        trackedEntityType: undefined,
        program: undefined,
        programStage: undefined,
        trackerDataView: {
            attributes: [],
            dataElements: [],
        },
    },
    attributeValues: [],
    ...overwrites,
})

describe('Relationship types form tests', () => {
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
                const attributes = [testCustomAttribute({ mandatory: false })]
                const trackedEntityTypes = [testTrackedEntityType()]
                const programs = [testProgram()]
                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}`}
                        customData={{
                            attributes: () => ({ attributes }),
                            trackedEntityTypes: () => ({
                                pager: {},
                                trackedEntityTypes,
                            }),
                            programs: () => ({
                                pager: {},
                                programs,
                            }),
                            relationshipTypes: (type: any, params: any) => {
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
                                            relationshipTypes: [
                                                testRelationshipType(),
                                            ],
                                        }
                                    }
                                    return {
                                        pager: { total: 0 },
                                        relationshipTypes: [],
                                    }
                                }
                            },
                        }}
                        routeOptions={routeOptions}
                    >
                        <New />
                    </TestComponentWithRouter>
                )
                return { screen, attributes, trackedEntityTypes, programs }
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
                'formfields-fromToName',
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

        it('should show an error if bidirectional is checked but toFromName is missing', async () => {
            const { screen } = await renderForm()
            const aName = faker.company.name()
            const fromToName = faker.lorem.words(3)

            await uiActions.enterName(aName, screen)
            await uiActions.enterInputFieldValue(
                'fromToName',
                fromToName,
                screen
            )
            await uiActions.clickOnCheckboxField('bidirectional', screen)
            await uiActions.submitForm(screen)

            expect(createMock).not.toHaveBeenCalled()
            uiAssertions.expectFieldToHaveError(
                'formfields-toFromName',
                'Relationship name seen from receiving entity is required when bidirectional is checked',
                screen
            )
        })
    })

    describe('New', () => {
        const renderForm = generateRenderer(
            { section, mockSchema: undefined },
            (routeOptions) => {
                const attributes = [testCustomAttribute({ mandatory: false })]
                const trackedEntityTypes = [testTrackedEntityType()]
                const programs = [testProgram()]
                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}`}
                        customData={{
                            attributes: () => ({ attributes }),
                            trackedEntityTypes: () => ({
                                pager: {},
                                trackedEntityTypes,
                            }),
                            programs: () => ({
                                pager: {},
                                programs,
                            }),
                            relationshipTypes: (type: any, params: any) => {
                                if (type === 'create') {
                                    createMock(params)
                                    return { statusCode: 204 }
                                }
                                if (type === 'read') {
                                    return {
                                        pager: { total: 0 },
                                        relationshipTypes: [],
                                    }
                                }
                            },
                        }}
                        routeOptions={routeOptions}
                    >
                        <New />
                    </TestComponentWithRouter>
                )
                return { screen, attributes, trackedEntityTypes, programs }
            }
        )

        it('contains all needed fields', async () => {
            const { screen } = await renderForm()

            uiAssertions.expectNameFieldExist('', screen)
            uiAssertions.expectCodeFieldExist('', screen)
            uiAssertions.expectTextAreaFieldToExist('description', null, screen)
            uiAssertions.expectCheckboxFieldToExist(
                'bidirectional',
                false,
                screen
            )
            uiAssertions.expectInputFieldToExist('fromToName', '', screen)

            // Constraint fields should exist
            expect(
                screen.getByTestId('from-constraint-selector')
            ).toBeInTheDocument()
            expect(
                screen.getByTestId('to-constraint-selector')
            ).toBeInTheDocument()
        })

        it('should show toFromName field when bidirectional is checked', async () => {
            const { screen } = await renderForm()

            expect(
                screen.queryByTestId('formfields-toFromName')
            ).not.toBeInTheDocument()

            await uiActions.clickOnCheckboxField('bidirectional', screen)

            expect(
                screen.getByTestId('formfields-toFromName')
            ).toBeInTheDocument()
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
            const aName = faker.company.name()
            const aCode = faker.string.alphanumeric(6)
            const aDescription = faker.lorem.sentence()
            const fromToName = faker.lorem.words(3)

            await uiActions.enterName(aName, screen)
            await uiActions.enterCode(aCode, screen)
            await uiActions.enterInputFieldValue(
                'description',
                aDescription,
                screen
            )
            await uiActions.enterInputFieldValue(
                'fromToName',
                fromToName,
                screen
            )

            // Set constraint values (required fields)
            const fromConstraintButton = screen.getByTestId(
                'from-constraint-selector-option-TRACKED_ENTITY_INSTANCE'
            )
            await userEvent.click(fromConstraintButton)

            const toConstraintButton = screen.getByTestId(
                'to-constraint-selector-option-TRACKED_ENTITY_INSTANCE'
            )
            await userEvent.click(toConstraintButton)

            await uiActions.submitForm(screen)

            expect(createMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        name: aName,
                        code: aCode,
                        description: aDescription,
                        bidirectional: false,
                        fromToName: fromToName,
                        toFromName: undefined,
                        fromConstraint: expect.objectContaining({
                            relationshipEntity: 'TRACKED_ENTITY_INSTANCE',
                        }),
                        toConstraint: expect.objectContaining({
                            relationshipEntity: 'TRACKED_ENTITY_INSTANCE',
                        }),
                        attributeValues: [],
                    }),
                })
            )
        })

        it('should submit with bidirectional relationship', async () => {
            const { screen } = await renderForm()
            const aName = faker.company.name()
            const fromToName = faker.lorem.words(3)
            const toFromName = faker.lorem.words(3)

            await uiActions.enterName(aName, screen)
            await uiActions.enterInputFieldValue(
                'fromToName',
                fromToName,
                screen
            )
            await uiActions.clickOnCheckboxField('bidirectional', screen)
            await uiActions.enterInputFieldValue(
                'toFromName',
                toFromName,
                screen
            )

            // Set constraint values (required fields)
            const fromConstraintButton = screen.getByTestId(
                'from-constraint-selector-option-TRACKED_ENTITY_INSTANCE'
            )
            await userEvent.click(fromConstraintButton)

            const toConstraintButton = screen.getByTestId(
                'to-constraint-selector-option-TRACKED_ENTITY_INSTANCE'
            )
            await userEvent.click(toConstraintButton)

            await uiActions.submitForm(screen)

            expect(createMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        name: aName,
                        bidirectional: true,
                        fromToName: fromToName,
                        toFromName: toFromName,
                        fromConstraint: expect.objectContaining({
                            relationshipEntity: 'TRACKED_ENTITY_INSTANCE',
                        }),
                        toConstraint: expect.objectContaining({
                            relationshipEntity: 'TRACKED_ENTITY_INSTANCE',
                        }),
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
                { relationshipTypeOverwrites = {}, id = randomDhis2Id() } = {}
            ) => {
                const attributes = [testCustomAttribute()]
                const trackedEntityTypes = [testTrackedEntityType()]
                const programs = [testProgram()]
                const relationshipType = testRelationshipType({
                    id,
                    ...relationshipTypeOverwrites,
                })

                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}/:id`}
                        initialEntries={[`/${section.namePlural}/${id}`]}
                        customData={{
                            attributes: () => ({ attributes }),
                            trackedEntityTypes: () => ({
                                pager: {},
                                trackedEntityTypes,
                            }),
                            programs: () => ({
                                pager: {},
                                programs,
                            }),
                            relationshipTypes: (type: any, params: any) => {
                                if (type === 'json-patch') {
                                    updateMock(params)
                                    return { statusCode: 204 }
                                }
                                if (type === 'read') {
                                    if (params?.id) {
                                        return relationshipType
                                    }
                                    return {
                                        pager: { total: 0 },
                                        relationshipTypes: [],
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
                    attributes,
                    trackedEntityTypes,
                    programs,
                    relationshipType,
                }
            }
        )

        it('contains the basic information fields prefilled', async () => {
            const { screen, relationshipType } = await renderForm()

            uiAssertions.expectNameFieldExist(relationshipType.name, screen)
            uiAssertions.expectCodeFieldExist(relationshipType.code, screen)
            uiAssertions.expectTextAreaFieldToExist(
                'description',
                relationshipType.description,
                screen
            )
            uiAssertions.expectCheckboxFieldToExist(
                'bidirectional',
                relationshipType.bidirectional,
                screen
            )
            uiAssertions.expectInputFieldToExist(
                'fromToName',
                relationshipType.fromToName,
                screen
            )
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

        it('should do nothing and return to the list view on success when no field is changed', async () => {
            const { screen } = await renderForm()
            await uiActions.submitForm(screen)
            expect(updateMock).not.toHaveBeenCalled()
        })

        it('should submit the data successfully when a field is changed', async () => {
            const { screen, relationshipType } = await renderForm()
            const newName = faker.company.name()

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
                id: relationshipType.id,
                params: undefined,
                resource: 'relationshipTypes',
            })
        })

        it('should submit when bidirectional is toggled', async () => {
            const { screen } = await renderForm()
            const toFromName = faker.lorem.words(3)

            await uiActions.clickOnCheckboxField('bidirectional', screen)
            await uiActions.enterInputFieldValue(
                'toFromName',
                toFromName,
                screen
            )

            await uiActions.submitForm(screen)

            expect(updateMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.arrayContaining([
                        expect.objectContaining({
                            op: 'replace',
                            path: '/bidirectional',
                            value: true,
                        }),
                        expect.objectContaining({
                            op: 'replace',
                            path: '/toFromName',
                            value: toFromName,
                        }),
                    ]),
                })
            )
        })
    })
})
