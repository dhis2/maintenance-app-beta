import {
    render,
    waitForElementToBeRemoved,
    fireEvent,
    waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import dataElementsMock from '../../__mocks__/gists/dataElementsMock.json'
import filteredDataElementsMock from '../../__mocks__/gists/filteredDataElementsMock.json'
import dataElementSchemaMock from '../../__mocks__/schema/dataElementsSchema.json'
import { SECTIONS_MAP } from '../../lib'
import { useSchemaStore } from '../../lib/schemas/schemaStore'
import { ModelSchemas } from '../../lib/useLoadApp'
import TestComponentWithRouter, {
    CustomData,
} from '../../testUtils/TestComponentWithRouter'
import { Component as DataElementList } from './List'

const renderSection = async (customData: CustomData) => {
    const routeOptions = {
        handle: { section: SECTIONS_MAP.dataElement },
    }

    const result = render(
        <TestComponentWithRouter
            path="/dataElements"
            customData={customData}
            routeOptions={routeOptions}
        >
            <DataElementList />
        </TestComponentWithRouter>
    )
    await waitForElementToBeRemoved(() =>
        result.queryByTestId('dhis2-uicore-circularloader')
    )
    return result
}

describe('Data Elements List', () => {
    jest.spyOn(console, 'warn').mockImplementation((value) => {
        if (!value.match(/No server timezone/)) {
            console.warn(value)
        }
    })

    useSchemaStore.getState().setSchemas({
        dataElement: dataElementSchemaMock,
    } as unknown as ModelSchemas)

    afterAll(jest.restoreAllMocks)

    it('should show the list of elements', async () => {
        const customData = {
            'dataElements/gist': dataElementsMock,
            userDataStore: {},
        }
        const { getByText, getByTestId } = await renderSection(customData)

        expect(
            getByText('Accute Flaccid Paralysis (Deaths < 5 yrs)')
        ).not.toBeNull()

        const { id } = dataElementsMock.result[0]
        const firstRow = getByTestId(`section-list-row-${id}`)
        expect(firstRow).toHaveTextContent(
            'Accute Flaccid Paralysis (Deaths < 5 yrs)AggregateNumber6 years agoPublic can edit'
        )
    })
    it('should display all the columns', async () => {
        const customData = {
            'dataElements/gist': dataElementsMock,
            userDataStore: {},
        }
        const { getByText } = await renderSection(customData)
        const columns = [
            'Name',
            'Domain',
            'Value',
            'Last updated',
            'Public access',
            'Actions',
        ]
        columns.forEach((colummn) => {
            expect(getByText(colummn)).not.toBeNull()
        })
    })
    it('should allow searching for value', async () => {
        const customData = {
            userDataStore: {},
            'dataElements/gist': (
                resource: string,
                r: { params: { filter: string[] } }
            ) => {
                const filters = r.params.filter?.join(',')
                switch (filters) {
                    case '':
                        return Promise.resolve(dataElementsMock)
                    case '0:name:ilike:Age of LLINs,0:code:ilike:Age of LLINs,0:shortName:ilike:Age of LLINs,0:id:eq:Age of LLINs':
                        return Promise.resolve(filteredDataElementsMock)
                    default:
                        return Promise.reject(
                            `no matched data provider for resource:${resource},filters:${filters}`
                        )
                }
            },
        }
        const { findByText, getByTestId } = await renderSection(customData)
        const searchInput =
            getByTestId('input-search-name').getElementsByTagName('input')[0]

        fireEvent.change(searchInput, {
            target: { value: 'Age of LLINs' },
        })

        await findByText('FILTERED Age of LLINs')
    })

    it('should display error when an API call fails', async () => {
        const customData = {
            userDataStore: {},
            'dataElements/gist': () => {
                return Promise.reject('401 backend error')
            },
        }
        const { getByText } = await renderSection(customData)

        expect(getByText('An error occurred')).not.toBeNull()
        expect(
            getByText('An error occurred while loading the items.')
        ).not.toBeNull()
    })
    describe('pager', () => {
        const pagerMock = jest.fn()
        afterEach(jest.resetAllMocks)

        const renderWithPager = async () => {
            const customData = {
                userDataStore: {},
                'dataElements/gist': (
                    resource: string,
                    r: { params: { filter: string[]; page: number } }
                ) => {
                    pagerMock(r)

                    const firstPage = {
                        pager: {
                            page: 1,
                            pageSize: 20,
                            total: 1061,
                            nextPage:
                                '/dataElements/gist?pageListName=result&total=true&order=name:ASC&fields=access,id,name,code,domainType,valueType,lastUpdated,sharing&pageSize=20&page=2',
                            pageCount: 54,
                        },
                        result: [
                            {
                                ...filteredDataElementsMock.result[0],
                                name: 'first page result',
                            },
                        ],
                    }
                    const secondPage = {
                        pager: {
                            page: 2,
                            pageSize: 20,
                            total: 1061,
                            prevPage:
                                '/dataElements/gist?pageListName=result&total=true&order=name:ASC&fields=access,id,name,code,domainType,valueType,lastUpdated,sharing&pageSize=20&page=1',
                            nextPage:
                                '/dataElements/gist?pageListName=result&total=true&order=name:ASC&fields=access,id,name,code,domainType,valueType,lastUpdated,sharing&pageSize=20&page=3',
                            pageCount: 54,
                        },
                        result: [
                            {
                                ...filteredDataElementsMock.result[0],
                                name: 'second page result',
                            },
                        ],
                    }

                    if (r.params.page === 1) {
                        return Promise.resolve(firstPage)
                    }
                    if (r.params.page === 2) {
                        return Promise.resolve(secondPage)
                    }

                    return Promise.reject('something wrong with mock')
                },
            }
            return renderSection(customData)
        }
        it('should display the page number', async () => {
            const { getByTestId } = await renderWithPager()

            const paginationFooter = getByTestId('section-list-pagination')

            expect(paginationFooter).toHaveTextContent('Page 1 of 54')
            expect(paginationFooter).toHaveTextContent('items 1-20 of 1061')
        })
        it('should disable previous page when on first page', async () => {
            const { getByTestId } = await renderWithPager()
            expect(
                getByTestId('dhis2-uiwidgets-pagination-page-previous')
            ).toHaveAttribute('disabled')
        })
        // next page
        it('should allowing going to Next page', async () => {
            const { getByTestId, findByText, queryByText } =
                await renderWithPager()

            userEvent.click(getByTestId('dhis2-uiwidgets-pagination-page-next'))

            await findByText('second page result')
            expect(queryByText('first page result')).toBeNull()
        })

        // previous page
        it('should allow going to Previous page ', async () => {
            const { getByTestId, findByText, queryByText } =
                await renderWithPager()

            // first page loaded
            await findByText('first page result')

            // go to next page
            userEvent.click(getByTestId('dhis2-uiwidgets-pagination-page-next'))
            await findByText('second page result')
            expect(queryByText('first page result')).toBeNull()

            // go back to previous page
            userEvent.click(
                getByTestId('dhis2-uiwidgets-pagination-page-previous')
            )
            await findByText('first page result')
            expect(queryByText('second page result')).toBeNull()
        })

        // skipping - this test just doesn't work and I can't tell why. It doesn't seem to show the last page (and when it does, it doesn't disable the button).
        // I tried different approaches and failed. Leaving it here temporarily in case someone want to give it  a go.
        it.skip('should not show next in last page', async () => {
            const { getByTestId, findByText } = await renderSection({
                userDataStore: {},
                'dataElements/gist': {
                    pager: {
                        page: 54,
                        pageSize: 20,
                        total: 1061,
                        prevPage:
                            '/dataElements/gist?pageListName=result&total=true&order=name:ASC&fields=access,id,name,code,domainType,valueType,lastUpdated,sharing&pageSize=20&page=53',
                        pageCount: 54,
                    },
                    result: [
                        {
                            ...filteredDataElementsMock.result[0],
                            name: 'last page result',
                        },
                    ],
                },
            })

            await findByText('last page result')
            // debug(getByTestId('section-list-pagination'))
            // await findByText('Page 54 of 54')
            await waitFor(
                () => {
                    expect(
                        getByTestId('dhis2-uiwidgets-pagination-page-next')
                    ).toHaveAttribute('disabled')
                },
                { timeout: 5 * 1000 }
            )
        })
    })
    // select all
    it('should allow selecting all items', async () => {
        const customData = {
            userDataStore: {},
            'dataElements/gist': dataElementsMock,
        }
        const { getByTestId, queryAllByTestId } = await renderSection(
            customData
        )

        userEvent.click(getByTestId('section-list-selectall'))

        const allCheckBoxes = queryAllByTestId('section-list-row-checkbox')

        expect(allCheckBoxes.length).toEqual(dataElementsMock.pager.pageSize)
        // the UI library doesn't seem to apply checked on the input, which would have been a better test, so checking "checked" class on the svg icon
        allCheckBoxes.forEach((checkbox) => {
            expect(checkbox.getElementsByTagName('svg')[0]).toHaveClass(
                'checked'
            )
        })
    })

    // empty list
    it('should allow selecting all items', async () => {
        const customData = {
            userDataStore: {},
            'dataElements/gist': { ...dataElementsMock, result: [] },
        }
        const { getByTestId } = await renderSection(customData)

        expect(getByTestId('dhis2-uicore-tablebody')).toHaveTextContent(
            "There aren't any items that match your filter."
        )
    })
})
