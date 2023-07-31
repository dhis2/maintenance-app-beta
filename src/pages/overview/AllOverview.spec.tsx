import { configure, render, within } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useIsSectionAuthorizedPredicate } from '../../lib'
import AllOverview from './AllOverview'

const mockedUseIsSectionAuthorizedPredicate = jest.mocked(
    useIsSectionAuthorizedPredicate
)

jest.mock('../../lib', () => {
    const originalModule = jest.requireActual('../../lib')
    return {
        ...originalModule,
        useIsSectionAuthorizedPredicate: jest.fn(),
    }
})

beforeEach(() => {
    configure({ testIdAttribute: 'data-test' })
    jest.resetAllMocks()
    mockedUseIsSectionAuthorizedPredicate.mockImplementation(() => () => true)
})

it('should render the home view with the appropriate cards', () => {
    const { getByText } = render(<AllOverview />, {
        wrapper: BrowserRouter,
    })

    expect(getByText('Metadata management')).toBeDefined()
    expect(getByText('Data elements')).toBeDefined()
    expect(getByText('Data element')).toBeDefined()
    expect(getByText('Data element group')).toBeDefined()
    expect(getByText('Data element group set')).toBeDefined()
    expect(getByText('Categories')).toBeDefined()
    expect(getByText('Category option')).toBeDefined()
})

it('should go to manage view when clicked', () => {
    const { getByTestId } = render(<AllOverview />, {
        wrapper: BrowserRouter,
    })

    within(getByTestId('card-Data element')).getByText('Manage').click()

    expect(window.location.href).toMatch(/dataElements$/)
})

it('should go to Add New view when clicked', () => {
    const { getByTestId } = render(<AllOverview />, {
        wrapper: BrowserRouter,
    })

    within(getByTestId('card-Data element')).getByText('Add new').click()

    expect(window.location.href).toMatch(/dataElements\/new$/)
})

it('should not show cards with unauthorized sections', () => {
    // jest.

    const unauthorizedSections = [
        'Category option',
        'Category option combination',
    ]
    mockedUseIsSectionAuthorizedPredicate.mockImplementation(
        () => (section) => !unauthorizedSections.includes(section.title)
    )
    const { getByText, queryByText } = render(<AllOverview />, {
        wrapper: BrowserRouter,
    })

    expect(getByText('Metadata management')).toBeDefined()
    expect(getByText('Data elements')).toBeDefined()
    expect(getByText('Data element')).toBeDefined()
    expect(getByText('Data element group')).toBeDefined()
    expect(getByText('Data element group set')).toBeDefined()
    expect(getByText('Categories')).toBeDefined()

    expect(queryByText('Category option')).toBeNull()
    expect(queryByText('Category option combination')).toBeNull()
})

it('should hide overview section if all sub-sections are unauthorized', () => {
    // all 'category' sections are unauthorized
    mockedUseIsSectionAuthorizedPredicate.mockImplementation(
        () => (section) => !section.title.toLowerCase().includes('category')
    )
    const { getByText, queryByText } = render(<AllOverview />, {
        wrapper: BrowserRouter,
    })

    expect(getByText('Metadata management')).toBeDefined()
    expect(getByText('Data elements')).toBeDefined()
    expect(getByText('Data element')).toBeDefined()
    expect(getByText('Data element group')).toBeDefined()
    expect(getByText('Data element group set')).toBeDefined()

    expect(queryByText('Category option')).toBeNull()
    expect(queryByText('Categories')).toBeNull()
    expect(queryByText('Category option group')).toBeNull()
    expect(queryByText('Category option combination')).toBeNull()
})
