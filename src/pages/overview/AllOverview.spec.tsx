import { configure, render, within } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AllOverview from './AllOverview'

beforeEach(() => {
    configure({ testIdAttribute: 'data-test' })
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
