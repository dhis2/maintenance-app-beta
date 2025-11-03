import { faker } from '@faker-js/faker'
import { render } from '@testing-library/react'
import React from 'react'
import schemaMock from '../../__mocks__/schema/categoriesSchema.json'
import { FOOTER_ID } from '../../app/layout/Layout'
import { SECTIONS_MAP } from '../../lib'
import {
    randomDhis2Id,
    randomLongString,
    testCategoryForm,
} from '../../testUtils/builders'
import { generateRenderer } from '../../testUtils/generateRenderer'
import TestComponentWithRouter from '../../testUtils/TestComponentWithRouter'
import { uiActions } from '../../testUtils/uiActions'
import { uiAssertions } from '../../testUtils/uiAssertions'
import { Component as New } from './New'
import resetAllMocks = jest.resetAllMocks

const section = SECTIONS_MAP.category
const mockSchema = schemaMock

jest.mock('use-debounce', () => ({
    useDebouncedCallback: (fn: any) => fn,
}))

const testCategoryOption = (overwrites: Record<any, any> = {}) => ({
    id: randomDhis2Id(),
    displayName: faker.person.firstName(),
    valueType: 'TEXT',
    ...overwrites,
})

describe('Categories form tests', () => {
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

        it('should show an error if short name field is too long', () => {})
        it('should show an error if code field is too long', () => {})
        it('should show an error if description field is too long', () => {})
        it('should show an error if name field is a duplicate', () => {})
        it('should show an error if short name field is a duplicate', () => {})
        it('should show an error if code field is a duplicate', () => {})
        it('not show an add all button for category options', () => {})
    })
    describe('New', () => {
        it('contain all needed field', () => {})
        it('should have a cancel button with a link back to the list view', () => {})
        it('should submit the data', () => {})
    })
    describe('Edit', () => {
        it('contain all needed field prefilled', () => {})
        it('should submit the data and return to the list view on success when a field is changed', () => {})
        it('should do nothing and return to the list view on success when no field is changed', () => {})
    })
})
