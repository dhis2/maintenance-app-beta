import { faker } from '@faker-js/faker'
import { render } from '@testing-library/react'
import React from 'react'
import schemaMock from '../../__mocks__/schema/categoriesSchema.json'
import { FOOTER_ID } from '../../app/layout/Layout'
import { SECTIONS_MAP } from '../../lib'
import {
    randomLongString,
    testCategoryForm,
    testCategoryOption,
} from '../../testUtils/builders'
import { generateRenderer } from '../../testUtils/generateRenderer'
import TestComponentWithRouter from '../../testUtils/TestComponentWithRouter'
import { uiActions } from '../../testUtils/uiActions'
import { uiAssertions } from '../../testUtils/uiAssertions'
import { Component as Edit } from './Edit'
import { Component as New } from './New'
import resetAllMocks = jest.resetAllMocks

const section = SECTIONS_MAP.category
const mockSchema = schemaMock
jest.mock('use-debounce', () => ({
    useDebouncedCallback: (fn: any) => fn,
}))

describe('Categories form tests', () => {
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
                const categoryOptions = [
                    testCategoryOption(),
                    testCategoryOption(),
                ]

                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}`}
                        customData={{
                            categoryOptions: () => ({ categoryOptions }),
                            categories: (type: any, params: any) => {
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
                                            categories: [testCategoryForm()],
                                        }
                                    }
                                    return {
                                        pager: { total: 0 },
                                        categories: [],
                                    }
                                }
                            },
                        }}
                        routeOptions={routeOptions}
                    >
                        <New />
                    </TestComponentWithRouter>
                )

                return { screen }
            }
        )

        it('should not submit when a required values is missing ', async () => {
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
            const longName = randomLongString(231)
            await uiActions.enterName(longName, screen)
            await uiAssertions.expectNameToErrorWhenExceedsLength(screen)
            await uiActions.submitForm(screen)
            expect(createMock).not.toHaveBeenCalled()
        })

        it('should show an error if short name field is too long', async () => {
            const { screen } = await renderForm()
            const longName = randomLongString(54)
            await uiActions.enterInputFieldValue('shortName', longName, screen)
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

        it('should show an error if description field is too long', async () => {
            const { screen } = await renderForm()
            const longText = randomLongString(2010)
            await uiActions.enterInputFieldValue(
                'description',
                longText,
                screen
            )
            await uiAssertions.expectInputToErrorWhenExceedsLength(
                'description',
                2000,
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

        it('not show an add all button for category options', async () => {
            const { screen } = await renderForm()
            const addAllButton = screen.getByTestId(
                'legendset-transfer-actions-addall'
            )
            expect(addAllButton).not.toBeVisible()
        })
    })

    describe('New', () => {
        const renderForm = generateRenderer(
            { section, mockSchema },
            (
                routeOptions,
                { matchingExistingElementFilter = undefined } = {}
            ) => {
                const categoryOptions = [
                    testCategoryOption(),
                    testCategoryOption(),
                ]
                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}`}
                        customData={{
                            categoryOptions: () => ({
                                categoryOptions,
                                pager: {},
                            }),
                            categories: (type: any, params: any) => {
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
                                            categories: [testCategoryForm()],
                                        }
                                    }
                                    return {
                                        pager: { total: 0 },
                                        categories: [],
                                    }
                                }
                            },
                        }}
                        routeOptions={routeOptions}
                    >
                        <New />
                    </TestComponentWithRouter>
                )
                return { screen, categoryOptions }
            }
        )

        it('contain all needed field', async () => {
            const { screen } = await renderForm()
            uiAssertions.expectNameFieldExist('', screen)
            uiAssertions.expectInputFieldToExist('shortName', '', screen)
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
            const { screen, categoryOptions } = await renderForm()
            const aName = faker.person.firstName()
            const aShortName = faker.person.lastName()

            await uiActions.enterName(aName, screen)
            await uiActions.enterInputFieldValue(
                aShortName,
                'shortName',
                screen
            )
            await uiActions.pickOptionInTransfer(
                'category-transfer',
                categoryOptions[1].displayName,
                screen
            )

            await uiActions.submitForm(screen)

            expect(createMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        name: aName,
                        shortName: aShortName,
                        categoryOptions: [
                            expect.objectContaining({
                                id: categoryOptions[0].id,
                            }),
                        ],
                    }),
                })
            )
        })
    })

    describe('Edit', () => {
        const renderForm = generateRenderer(
            { section, mockSchema },
            (routeOptions) => {
                const categoryOptions = [
                    testCategoryOption(),
                    testCategoryOption(),
                ]
                const categories = testCategoryForm()
                categories.categoryOptions = [categoryOptions[0]]
                const id = categories.id

                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}/:id`}
                        initialEntries={[`/${section.namePlural}/${id}`]}
                        customData={{
                            categoryOptions: () => ({
                                categoryOptions,
                                pager: {},
                            }),
                            categories: (type: any, params: any) => {
                                if (type === 'update') {
                                    updateMock(params)
                                    return { statusCode: 204 }
                                }
                                if (type === 'read' && params?.id) {
                                    return { ...categories }
                                }
                                return {
                                    pager: { total: 0 },
                                    categories: [],
                                }
                            },
                        }}
                        routeOptions={routeOptions}
                    >
                        <Edit />
                    </TestComponentWithRouter>
                )
                return { screen, categoryOptions, categories }
            }
        )

        it('contain all needed field prefilled', async () => {
            const { screen, categories } = await renderForm()

            uiAssertions.expectNameFieldExist(categories.name, screen)
            uiAssertions.expectInputFieldToExist(
                'shortName',
                categories.shortName,
                screen
            )
        })

        it('should submit the data and return to the list view on success when a field is changed', async () => {
            const { screen, categories } = await renderForm()
            const aCode = faker.string.alpha(5)

            uiAssertions.expectNameFieldExist(categories.name, screen)
            uiAssertions.expectInputFieldToExist(
                'shortName',
                categories.shortName,
                screen
            )

            await uiActions.submitForm(screen)

            expect(createMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        name: categories.name,
                        shortName: categories.shortName,
                        code: aCode,
                    }),
                })
            )
        })

        it('should do nothing and return to the list view on success when no field is changed', async () => {
            const { screen } = await renderForm()
            await uiActions.submitForm(screen)
            expect(updateMock).not.toHaveBeenCalled()
        })
    })
})
