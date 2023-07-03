import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'

jest.mock('./SidebarLinks', () => {
    const originalModule = jest.requireActual('./SidebarLinks')
    const links = Object.values(originalModule.sidebarLinks)
    //Mock the default export and named export 'foo'
    return {
        __esModule: true,
        ...originalModule,
        useSidebarLinks: jest.fn(() => {
            return Object.values(links)
        }),
    }
})

describe('Sidebar', () => {
    const renderSideBar = () =>
        render(<Sidebar />, {
            wrapper: BrowserRouter,
        })
    it('should display the list of top-level categories', () => {
        const { getByText } = renderSideBar()

        const topLevelCategories = [
            'Metadata Overview',
            'Categories',
            'Data elements',
            'Data sets',
            'Indicators',
            'Organisation units',
            'Programs and Tracker',
            'Validations',
        ]

        topLevelCategories.forEach((title) =>
            expect(getByText(title)).toBeDefined()
        )
    })
    it('should display the list of links inside a category when clicked', async () => {
        const { queryByText, getByText } = renderSideBar()

        const subCategories = [
            'Overview',
            'Category option',
            'Category combination',
            'Category option combination',
        ]
        subCategories.forEach((title) => expect(queryByText(title)).toBeNull())

        getByText('Categories').click()

        subCategories.forEach((title) =>
            expect(getByText(title)).not.toBeNull()
        )
    })
    describe('when a link is clicked', () => {
        it('should navigate to the target of the link', () => {
            const { getByText } = renderSideBar()
            getByText('Categories').click()
            getByText('Category combination').click()
            expect(window.location.href).toMatch('/categoryCombos')
            getByText('Overview').click()
            expect(window.location.href).toMatch('/overview/categories')
        })
    })

    describe('searching', () => {
        it('should filter the list when a search string is entered', () => {
            const { getByPlaceholderText, getByText, queryByText } =
                renderSideBar()

            expect(queryByText('Data element group')).toBeNull()

            userEvent.type(getByPlaceholderText(/Search/), 'elements')

            expect(getByText('Data elements')).toBeDefined()
            expect(getByText('Overview')).toBeDefined()
            expect(getByText('Data element group')).toBeDefined()
            expect(getByText('Data element group set')).toBeDefined()
        })
        it('should allow searching for a match in a subcategory', () => {
            const { getByPlaceholderText, getByText, queryByText } =
                renderSideBar()

            expect(queryByText('Data element group')).toBeNull()

            userEvent.type(getByPlaceholderText(/Search/), 'group')

            expect(queryByText('Overview')).toBeNull()
            expect(getByText('Data element group')).toBeDefined()
            expect(getByText('Data element group set')).toBeDefined()
        })
        describe('when no match', () => {
            it('should display an appropriate message', () => {
                const { getByPlaceholderText, getByText, queryByText } =
                    renderSideBar()

                expect(queryByText('Data element group')).toBeNull()

                userEvent.type(
                    getByPlaceholderText(/Search/),
                    'something not in list'
                )

                expect(getByText(/No menu items found for/)).toBeDefined()
            })
            it('should still display "MetaData Overview"', () => {
                const { getByPlaceholderText, getByText, queryByText } =
                    renderSideBar()

                expect(queryByText('Data element group')).toBeNull()

                userEvent.type(
                    getByPlaceholderText(/Search/),
                    'something not in list'
                )

                expect(getByText('Metadata Overview')).toBeDefined()
            })
        })
    })

    it('should allow tabbing through the menu', () => {
        const { getByPlaceholderText, getByText } = renderSideBar()

        getByPlaceholderText(/Search/).focus()
        userEvent.tab()
        expect(getByText('Metadata Overview')).toHaveFocus()
        userEvent.tab()
        expect(getByText('Categories').parentElement).toHaveFocus()
    })
})
