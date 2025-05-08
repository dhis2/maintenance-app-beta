import { FetchError } from '@dhis2/app-runtime'
import { faker } from '@faker-js/faker'
import {
    render,
    waitFor,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
    modelListViewsConfig,
    ModelPropertyConfig,
    ModelSchemas,
    SchemaName,
    SectionListViewConfig,
    SectionName,
    toModelPropertyDescriptor,
} from '../lib'
import { useSchemaStore } from '../lib/schemas/schemaStore'
import { useCurrentUserStore } from '../lib/user/currentUserStore'
import { testOrgUnit } from '../testUtils/builders'
import TestComponentWithRouter from '../testUtils/TestComponentWithRouter'
import { ModelSection } from '../types'
import type { OrganisationUnit } from '../types/generated'

type TestConfig = {
    section: ModelSection
    mockSchema: Record<any, any>
    ComponentToTest: () => React.ReactElement
    generateRandomElement: () => Record<any, any>
    customData: Record<any, any>
    componentName?: undefined
}
export const generateDefaultListTests = (
    testConfigs: TestConfig | { componentName: string; section?: undefined }
) => {
    if (testConfigs.section !== undefined) {
        generateDefaultListItemsTests(testConfigs)
    }
    generateDefaultListFiltersTests({
        componentName:
            testConfigs.section?.namePlural ?? testConfigs.componentName ?? '',
    })
    generateDefaultListRowActionsTests({
        componentName:
            testConfigs.section?.namePlural ?? testConfigs.componentName ?? '',
    })
    generateDefaultListMultiActionsTests({
        componentName:
            testConfigs.section?.namePlural ?? testConfigs.componentName ?? '',
    })
}

const defaultUserDataStoreData = () => Promise.reject(new FetchError(error404))
const originalWarn = console.warn
jest.spyOn(console, 'warn').mockImplementation((value) => {
    if (!value.match(/No server timezone/)) {
        originalWarn(value)
    }
})

const error404 = new FetchError({
    type: 'unknown',
    message: '404 not found',
    details: { httpStatusCode: 404 } as FetchError['details'],
})

export const generateDefaultListItemsTests = ({
    section,
    mockSchema,
    ComponentToTest,
    generateRandomElement,
    customData,
}: TestConfig) => {
    function LocationWatcher({
        onChange,
    }: {
        onChange: (search: string) => void
    }) {
        const location = useLocation()

        useEffect(() => {
            onChange(location.search)
        }, [location.search, onChange])

        return null
    }

    const renderList = async ({
        userDataStore = defaultUserDataStoreData,
        rootOrgUnits = [testOrgUnit()] as Partial<OrganisationUnit>[],
    } = {}) => {
        const routeOptions = {
            handle: { section },
        }

        useSchemaStore.getState().setSchemas({
            [section.name]: mockSchema,
        } as unknown as ModelSchemas)

        useCurrentUserStore.getState().setCurrentUser({
            organisationUnits: rootOrgUnits as OrganisationUnit[],
            authorities: new Set(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            settings: {},
        })

        const elements = [
            generateRandomElement(),
            generateRandomElement(),
            generateRandomElement(),
            generateRandomElement(),
            generateRandomElement(),
            generateRandomElement(),
        ]
        const pager = {
            page: 1,
            total: elements.length,
            pageSize: 20,
            pageCount: Math.ceil(elements.length / 20),
        }

        const screen = render(
            <TestComponentWithRouter
                path={`/${section.namePlural}`}
                customData={{
                    ...customData,
                    [section.namePlural]: (type: any, params: any) => {
                        if (type === 'read') {
                            return {
                                [section.namePlural]: elements,
                                pager,
                            }
                        }
                    },
                    userDataStore,
                }}
                routeOptions={routeOptions}
            >
                <ComponentToTest />
            </TestComponentWithRouter>
        )

        await waitForElementToBeRemoved(() =>
            screen.queryByTestId('dhis2-uicore-circularloader')
        )
        return { screen, elements, pager }
    }

    describe(`${section.namePlural} default list tests`, () => {
        it('should display all the items in the first page', async () => {
            const { screen, elements } = await renderList()
            const tableRows = screen.getAllByTestId('section-list-row')
            expect(tableRows.length).toBe(elements.length)
            elements.forEach((element, index) => {
                expect(tableRows[index]).toHaveTextContent(element.displayName)
            })
        })

        it('should display the default columns', async () => {
            const { screen } = await renderList()
            const tableHeaders = screen.getAllByTestId(
                'dhis2-uicore-datatablecellhead'
            )
            const sectionName =
                section.name as keyof typeof modelListViewsConfig
            const configs = modelListViewsConfig[sectionName] as Record<
                string,
                any
            >
            const columnsToRender = configs?.columns?.default
            expect(tableHeaders).toHaveLength(columnsToRender.length + 2)
            columnsToRender.forEach(
                (column: ModelPropertyConfig, index: number) => {
                    expect(tableHeaders[index + 1]).toHaveTextContent(
                        toModelPropertyDescriptor(column).label
                    )
                }
            )
        })

        xit('can change the visible columns through manage view', async () => {
            const { screen } = await renderList()
            await userEvent.click(
                await screen.findByTestId('manage-view-button')
            )

            await waitFor(() => {
                const manageViewModal = screen.getByTestId('manage-view-modal')
                expect(manageViewModal).toBeVisible()
            })
        })
        xit('should change the number of items that are displayed in a page when the number of items per page is changed', async () => {})
        xit('can navigate through pages and show the corresponding items', () => {})
        xit('can sort the results by columns using a non case sensitive manner', () => {})
        xit('should display error when an API call fails', () => {})
    })
}

export const generateDefaultListFiltersTests = ({
    componentName,
}: {
    componentName: string
}) => {
    xdescribe(`${componentName} default filter tests`, () => {
        it('can filter the results by code using the input field', () => {})
        it('can filter the results by name using the input field', () => {})
        it('can filter the results by id using the input field', () => {})
        it('should show message when no items match filter', () => {})
        it('should display the default filters', () => {})
        it('can change the visible filters through manage view', () => {})
        it('can remove all filters through manage view', () => {})
    })
}

export const generateDefaultListRowActionsTests = ({
    componentName,
}: {
    componentName: string
}) => {
    xdescribe(`${componentName} default row actions tests`, () => {
        it('should display the default actions in the actions menu', () => {})
        it('redirect to the edit page when clicking on the edit action', () => {})
        it('redirects to the edit page when clicking on the pencil icon', () => {})
        it('deletes an item when pressing the delete action and confirming', () => {})
        it('updates the list when an item is deleted', () => {})
        it('shows the detail panel when the show details action is clicked', () => {})
        it('shows an edit button in the details panel', () => {})
        it('can copy the api url in the details panel', () => {})
        it('should open the sharing settings dialog when the sharing settings action is clicked', () => {})
        it('should update the list view when the sharing settings dialog is closed', () => {})
        it('should open a translation dialog when the translate action is clicked', () => {})
        it('should successfully save a new translation', () => {})
    })
}

export const generateDefaultListMultiActionsTests = ({
    componentName,
}: {
    componentName: string
}) => {
    xdescribe(`${componentName} default multiple actions tests`, () => {
        it('should display the multiple actions banner when 1 or more items are selected', () => {})
        it('should indicate how many items were selected', () => {})
        it('should update sharing settings for multiple items', () => {})
        it('should download multiple items', () => {})
        it('deselects all selected items', () => {})
    })
}
