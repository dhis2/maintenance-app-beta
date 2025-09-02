import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import {
    useIsSectionAuthorizedPredicate,
    useIsSectionFeatureToggle,
} from '../../lib'
import { Section } from '../../types'
import { Sidebar } from './Sidebar'

const mockedUseIsSectionAuthorizedPredicate = jest.mocked(
    useIsSectionAuthorizedPredicate
)

const mockedUseIsSectionFeatureToggle = jest.mocked(useIsSectionFeatureToggle)

jest.mock('../../lib', () => {
    const originalModule = jest.requireActual('../../lib')
    return {
        ...originalModule,
        useIsSectionAuthorizedPredicate: jest.fn(),
        useIsSectionFeatureToggle: jest.fn(),
        useCanCreateModelInSection: jest.fn(() => true),
    }
})

describe('Sidebar', () => {
    const renderSideBar = () =>
        render(<Sidebar />, {
            wrapper: BrowserRouter,
        })

    beforeEach(() => {
        // reset url to root
        window.history.pushState({}, '', '/')
        jest.resetAllMocks()
        mockedUseIsSectionAuthorizedPredicate.mockImplementation(
            () => () => true
        )
        mockedUseIsSectionFeatureToggle.mockImplementation(() => () => true)
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

        await userEvent.click(getByText('Categories'))

        subCategories.forEach((title) =>
            expect(getByText(title)).not.toBeNull()
        )
    })
    describe('when a link is clicked', () => {
        it('should navigate to the target of the link', async () => {
            const { getByText } = renderSideBar()
            await userEvent.click(getByText('Categories'))
            await userEvent.click(getByText('Category combination'))
            expect(window.location.href).toMatch('/categoryCombos')
            await userEvent.click(getByText('Overview'))
            expect(window.location.href).toMatch('/overview/categories')
        })
    })

    describe('searching', () => {
        it('should filter the list when a search string is entered', async () => {
            const user = userEvent.setup()
            const { getByPlaceholderText, getByText, queryByText } =
                renderSideBar()

            expect(queryByText('Data element group')).toBeNull()

            await user.type(getByPlaceholderText(/Search/), 'elements')

            expect(getByText('Data elements')).toBeDefined()
            expect(getByText('Overview')).toBeDefined()
            expect(getByText('Data element group')).toBeDefined()
            expect(getByText('Data element group set')).toBeDefined()
        })
        it('should allow searching for a match in a subcategory', async () => {
            const user = userEvent.setup()
            const { getByPlaceholderText, getByText, queryByText } =
                renderSideBar()

            expect(queryByText('Data element group')).toBeNull()

            await user.type(getByPlaceholderText(/Search/), 'group')

            expect(queryByText('Overview')).toBeNull()
            expect(getByText('Data element group')).toBeDefined()
            expect(getByText('Data element group set')).toBeDefined()
        })
        describe('when no match', () => {
            it('should display an appropriate message', async () => {
                const user = userEvent.setup()
                const { getByPlaceholderText, getByText, queryByText } =
                    renderSideBar()

                expect(queryByText('Data element group')).toBeNull()

                await user.type(
                    getByPlaceholderText(/Search/),
                    'something not in list'
                )

                expect(getByText(/No menu items found for/)).toBeDefined()
            })
            it('should still display "MetaData Overview"', async () => {
                const user = userEvent.setup()
                const { getByPlaceholderText, getByText, queryByText } =
                    renderSideBar()

                expect(queryByText('Data element group')).toBeNull()

                await user.type(
                    getByPlaceholderText(/Search/),
                    'something not in list'
                )

                expect(getByText('Metadata Overview')).toBeDefined()
            })
        })
    })

    it('should allow tabbing through the menu', async () => {
        const user = userEvent.setup()
        const { getByPlaceholderText, getByText } = renderSideBar()

        getByPlaceholderText(/Search/).focus()
        await user.tab()
        expect(getByText('Metadata Overview')).toHaveFocus()
        await user.tab()
        expect(getByText('Categories').parentElement).toHaveFocus()
    })

    describe('unauthorized sections', () => {
        it('should hide child links that link to unauthorized sections', async () => {
            const unauthorizedSections = [
                'Category option',
                'Category combination',
                'Category option combination',
            ]

            const checkSection = (section: Section) =>
                !unauthorizedSections.includes(section.title)
            mockedUseIsSectionAuthorizedPredicate.mockImplementation(
                () => checkSection
            )
            const { queryByText, getByText } = renderSideBar()
            const expectedSubCategories = [
                'Overview',
                'Category option group',
                'Category option group set',
            ]
            expectedSubCategories.forEach((title) =>
                expect(queryByText(title)).toBeNull()
            )
            await userEvent.click(getByText('Categories'))
            expectedSubCategories.forEach((title) =>
                expect(getByText(title)).not.toBeNull()
            )
            expect(queryByText('Category option')).toBeNull()
            expect(queryByText('Category combination')).toBeNull()
            expect(queryByText('Category option combination')).toBeNull()
        })

        it('should hide parent if all children are unauthorized', () => {
            const checkSection = (section: Section) =>
                !section.title.toLowerCase().includes('category')
            mockedUseIsSectionAuthorizedPredicate.mockImplementation(
                () => checkSection
            )
            const { queryByText } = renderSideBar()
            expect(queryByText('Categories')).toBeNull()
        })
    })

    describe('version incompatible sections', () => {
        it('should hide child links that link to non feature toggled sections', async () => {
            const unauthorizedSections = [
                'Category option',
                'Category combination',
                'Category option combination',
            ]
            const checkSection = (section: Section) =>
                !unauthorizedSections.includes(section.title)
            mockedUseIsSectionFeatureToggle.mockImplementation(
                () => checkSection
            )

            const { queryByText, getByText } = renderSideBar()
            const expectedSubCategories = [
                'Overview',
                'Category option group',
                'Category option group set',
            ]
            expectedSubCategories.forEach((title) =>
                expect(queryByText(title)).toBeNull()
            )
            await userEvent.click(getByText('Categories'))
            expectedSubCategories.forEach((title) =>
                expect(getByText(title)).not.toBeNull()
            )
            expect(queryByText('Category option')).toBeNull()
            expect(queryByText('Category combination')).toBeNull()
            expect(queryByText('Category option combination')).toBeNull()
        })

        it('should hide parent if all children are unauthorized', () => {
            const checkSection = (section: Section) =>
                !section.title.toLowerCase().includes('category')
            mockedUseIsSectionFeatureToggle.mockImplementation(
                () => checkSection
            )

            const { queryByText } = renderSideBar()
            expect(queryByText('Categories')).toBeNull()
        })
    })
})
