import '@testing-library/jest-dom'
import { configure, render } from '@testing-library/react'
import React from 'react'
import { useMatches, HashRouter } from 'react-router-dom'
import { OVERVIEW_SECTIONS, SECTIONS_MAP } from '../../lib'
import { MatchRouteHandle, RouteHandle } from '../routes/types'
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumb'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useMatches: jest.fn(),
}))

const mockedUseMatches = jest.mocked(useMatches)

let mockId = 0

const mockHandle = (handle: RouteHandle) => {
    return { id: `${mockId++}`, handle } as MatchRouteHandle
}

beforeEach(() => {
    configure({ testIdAttribute: 'data-test' })
    jest.resetAllMocks()
    mockedUseMatches.mockReturnValue([
        mockHandle({
            crumb: () => <div>Crumb 1</div>,
        }),

        mockHandle({
            crumb: () => <div>Crumb 2</div>,
        }),
    ])
})

describe('BreadcrumbItem', () => {
    it('should render a link based on the section title', () => {
        const { getByRole } = render(
            <BreadcrumbItem section={SECTIONS_MAP.dataElement} />,
            { wrapper: HashRouter }
        )

        const DataElementLink = getByRole('link')
        expect(DataElementLink).toBeDefined()
        expect(DataElementLink).toHaveTextContent('Data element')
        expect(DataElementLink).toHaveAttribute('href', '#/dataElements')
    })

    it('should render a link to overview-section using plural title if overview-section', () => {
        const { getByRole } = render(
            <BreadcrumbItem section={OVERVIEW_SECTIONS.dataElement} />,
            { wrapper: HashRouter }
        )

        const DataElementOverviewLink = getByRole('link')
        expect(DataElementOverviewLink).toBeDefined()
        expect(DataElementOverviewLink).toHaveTextContent('Data elements')
        expect(DataElementOverviewLink).toHaveAttribute(
            'href',
            '#/overview/dataElements'
        )
    })
    it('should render a link with label-prop instead of section title if provided', () => {
        const { getByRole } = render(
            <BreadcrumbItem
                section={SECTIONS_MAP.dataElement}
                label={'Custom label'}
            />,
            { wrapper: HashRouter }
        )

        const DataElementLink = getByRole('link')
        expect(DataElementLink).toBeDefined()
        expect(DataElementLink).toHaveTextContent('Data elements')
        expect(DataElementLink).toHaveAttribute('href', '#/dataElements')
    })
})
describe('Breadcrumbs', () => {
    it('should render crumb components in handle ', () => {
        const { getByText } = render(<Breadcrumbs />, { wrapper: HashRouter })

        expect(getByText('Crumb 1')).toBeDefined()
        expect(getByText('Crumb 2')).toBeDefined()
    }),
        it('should not crash when no crumb components are in handle ', () => {
            mockedUseMatches.mockReturnValue([
                mockHandle({ hideSidebar: true }),
            ])

            const { queryByText } = render(<Breadcrumbs />)

            expect(queryByText('Crumb 1')).not.toBeInTheDocument()
            expect(queryByText('Crumb 2')).not.toBeInTheDocument()
        })

    describe('with BreadcrumbItem', () => {
        beforeEach(() => {
            mockedUseMatches.mockReturnValue([
                mockHandle({
                    crumb: () => (
                        <BreadcrumbItem
                            section={OVERVIEW_SECTIONS.dataElement}
                        />
                    ),
                }),
                mockHandle({
                    crumb: () => (
                        <BreadcrumbItem section={SECTIONS_MAP.dataElement} />
                    ),
                }),
            ])
        })
        it('should render links in order', () => {
            const { getAllByRole } = render(<Breadcrumbs />, {
                wrapper: HashRouter,
            })

            const links = getAllByRole('link')

            expect(links).toHaveLength(2)
            const [DataElementOverViewLink, DataElementListLink] = links

            expect(DataElementOverViewLink).toHaveTextContent('Data elements')
            expect(DataElementOverViewLink).toHaveAttribute(
                'href',
                '#/overview/dataElements'
            )

            expect(DataElementListLink).toHaveTextContent('Data element')
            expect(DataElementListLink).toHaveAttribute(
                'href',
                '#/dataElements'
            )

            // see https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
            expect(
                DataElementOverViewLink.compareDocumentPosition(
                    DataElementListLink
                )
            ).toBe(4)
        })
    })
})
