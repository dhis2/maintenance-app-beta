import { faker } from '@faker-js/faker'
import { render, waitFor, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import schemaMock from '../../__mocks__/schema/categoryCombosSchema.json'
import { FOOTER_ID } from '../../app/layout/Layout'
import { SECTIONS_MAP } from '../../lib'
import {
    randomLongString,
    testCategory,
    testCategoryCombo,
} from '../../testUtils/builders'
import { generateRenderer } from '../../testUtils/generateRenderer'
import TestComponentWithRouter from '../../testUtils/TestComponentWithRouter'
import { uiActions } from '../../testUtils/uiActions'
import { uiAssertions } from '../../testUtils/uiAssertions'
import { Component as Edit } from './Edit'
import { Component as New } from './New'
import resetAllMocks = jest.resetAllMocks

const section = SECTIONS_MAP.categoryCombo
const mockSchema = schemaMock
jest.mock('use-debounce', () => ({
    useDebouncedCallback: (fn: any) => fn,
}))

describe('Category combos form tests', () => {
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
                const categories = [
                    testCategory({ categoryOptionsSize: 2 }),
                    testCategory({ categoryOptionsSize: 3 }),
                    testCategory({ categoryOptionsSize: 4 }),
                ]
                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}`}
                        customData={{
                            categories: (type: any, params: any) => {
                                if (type === 'read') {
                                    return {
                                        categories,
                                        pager: {
                                            page: 1,
                                            total: categories.length,
                                            pageSize: 20,
                                            pageCount: 1,
                                        },
                                    }
                                }
                            },
                            categoryCombos: (type: any, params: any) => {
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
                                            categoryCombos: [
                                                testCategoryCombo(),
                                            ],
                                        }
                                    }
                                    return {
                                        pager: { total: 0 },
                                        categoryCombos: [],
                                    }
                                }
                            },
                        }}
                        routeOptions={routeOptions}
                    >
                        <New />
                    </TestComponentWithRouter>
                )
                return { screen, categories }
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

        it('should not show an add all button for categories', async () => {
            const { screen } = await renderForm()
            const transferField = screen.getByTestId('formfields-modeltransfer')
            expect(transferField).toBeInTheDocument()
            const addAllButton = transferField.querySelector(
                '[data-test*="add-all"]'
            )
            expect(addAllButton).toBeNull()
        })
    })

    describe('New', () => {
        const renderForm = generateRenderer(
            { section, mockSchema },
            (
                routeOptions,
                { matchingExistingElementFilter = undefined } = {}
            ) => {
                const categories = [
                    testCategory({ categoryOptionsSize: 2 }),
                    testCategory({ categoryOptionsSize: 3 }),
                    testCategory({ categoryOptionsSize: 4 }),
                ]
                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}`}
                        customData={{
                            categories: (type: any, params: any) => {
                                if (type === 'read') {
                                    return {
                                        categories,
                                        pager: {
                                            page: 1,
                                            total: categories.length,
                                            pageSize: 20,
                                            pageCount: 1,
                                        },
                                    }
                                }
                            },
                            categoryCombos: (type: any, params: any) => {
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
                                            categoryCombos: [
                                                testCategoryCombo(),
                                            ],
                                        }
                                    }
                                    return {
                                        pager: { total: 0 },
                                        categoryCombos: [],
                                    }
                                }
                            },
                        }}
                        routeOptions={routeOptions}
                    >
                        <New />
                    </TestComponentWithRouter>
                )
                return { screen, categories }
            }
        )

        it('contain all needed field', async () => {
            const { screen } = await renderForm()

            uiAssertions.expectNameFieldExist('', screen)
            uiAssertions.expectCodeFieldExist('', screen)
            const disaggregationRadio = screen.getByLabelText('Disaggregation')
            const attributeRadio = screen.getByLabelText('Attribute')
            expect(disaggregationRadio).toBeChecked()
            expect(attributeRadio).not.toBeChecked()
            const skipTotalCheckbox = screen.getByLabelText(
                'Skip category total in reports'
            )
            expect(skipTotalCheckbox).not.toBeChecked()
            const transferField = screen.getByTestId('formfields-modeltransfer')
            expect(transferField).toBeVisible()
            await waitFor(() => {
                const transfer = within(transferField).getByTestId(
                    'dhis2-uicore-transfer'
                )
                expect(transfer).toBeVisible()
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
            const { screen, categories } = await renderForm()
            const aName = faker.company.name()
            const aCode = faker.science.chemicalElement().symbol

            await uiActions.enterName(aName, screen)
            await uiActions.enterCode(aCode, screen)
            const attributeRadio = screen.getByLabelText('Attribute')
            await userEvent.click(attributeRadio)
            const skipTotalCheckbox = screen.getByLabelText(
                'Skip category total in reports'
            )
            await userEvent.click(skipTotalCheckbox)
            const transferField = screen.getByTestId('formfields-modeltransfer')
            await waitFor(() => {
                const transfer = within(transferField).getByTestId(
                    'dhis2-uicore-transfer'
                )
                expect(transfer).toBeVisible()
            })
            const categoryOption = await screen.findByText(
                categories[0].displayName,
                { selector: '[data-test="dhis2-uicore-transferoption"]' }
            )
            await userEvent.dblClick(categoryOption)

            await uiActions.submitForm(screen)

            expect(createMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        name: aName,
                        code: aCode,
                        dataDimensionType: 'ATTRIBUTE',
                        skipTotal: true,
                        categories: [
                            expect.objectContaining({
                                id: categories[0].id,
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
                const categories = [
                    testCategory({ categoryOptionsSize: 2 }),
                    testCategory({ categoryOptionsSize: 3 }),
                    testCategory({ categoryOptionsSize: 4 }),
                ]
                const categoryCombo = {
                    ...testCategoryCombo(),
                    dataDimensionType: 'DISAGGREGATION',
                    skipTotal: false,
                    categories: [
                        {
                            id: categories[0].id,
                            displayName: categories[0].displayName,
                            categoryOptionsSize: (categories[0] as any)
                                .categoryOptionsSize,
                        },
                    ],
                }
                const id = categoryCombo.id
                const screen = render(
                    <TestComponentWithRouter
                        path={`/${section.namePlural}/:id`}
                        initialEntries={[`/${section.namePlural}/${id}`]}
                        customData={{
                            categories: (type: any, params: any) => {
                                if (type === 'read') {
                                    return {
                                        categories,
                                        pager: {
                                            page: 1,
                                            total: categories.length,
                                            pageSize: 20,
                                            pageCount: 1,
                                        },
                                    }
                                }
                            },
                            categoryCombos: (type: any, params: any) => {
                                if (type === 'read') {
                                    if (params?.id) {
                                        return {
                                            ...categoryCombo,
                                        }
                                    }
                                    return {
                                        pager: { total: 0 },
                                        categoryCombos: [],
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
                        <Edit />
                    </TestComponentWithRouter>
                )
                return {
                    screen,
                    categories,
                    categoryCombo,
                }
            }
        )

        it('contain all needed field prefilled', async () => {
            const { screen, categoryCombo } = await renderForm()

            uiAssertions.expectNameFieldExist(categoryCombo.name, screen)
            uiAssertions.expectCodeFieldExist(categoryCombo.code, screen)
            const disaggregationRadio = screen.getByLabelText('Disaggregation')
            const attributeRadio = screen.getByLabelText('Attribute')
            expect(disaggregationRadio).toBeChecked()
            expect(attributeRadio).not.toBeChecked()
            expect(disaggregationRadio).toBeDisabled()
            expect(attributeRadio).toBeDisabled()
            const skipTotalCheckbox = screen.getByLabelText(
                'Skip category total in reports'
            )
            expect(skipTotalCheckbox).not.toBeChecked()
            const transferField = screen.getByTestId('formfields-modeltransfer')
            expect(transferField).toBeVisible()
            await waitFor(() => {
                const transfer = within(transferField).getByTestId(
                    'dhis2-uicore-transfer'
                )
                expect(transfer).toBeVisible()
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

        it('should submit the data and return to the list view on success when a field is changed', async () => {
            const { screen, categoryCombo } = await renderForm()
            const newName = faker.company.name()

            await uiActions.enterName(newName, screen)

            await uiActions.submitForm(screen)

            expect(updateMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: categoryCombo.id,
                    data: expect.arrayContaining([
                        expect.objectContaining({
                            path: '/name',
                            value: newName,
                        }),
                    ]),
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
