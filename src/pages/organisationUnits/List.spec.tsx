import { FetchError } from '@dhis2/app-runtime'
import { faker } from '@faker-js/faker'
import {
    fireEvent,
    render,
    waitFor,
    waitForElementToBeRemoved,
    within,
} from '@testing-library/react'
import React from 'react'
import organisationUnitsSchemaMock from '../../__mocks__/schema/organisationUnitsSchema.json'
import { getRelativeTime, ModelSchemas, SECTIONS_MAP } from '../../lib'
import { useSchemaStore } from '../../lib/schemas/schemaStore'
import { useCurrentUserStore } from '../../lib/user/currentUserStore'
import { testAccess, testOrgUnit, testPager } from '../../testUtils/builders'
import TestComponentWithRouter, {
    CustomData,
} from '../../testUtils/TestComponentWithRouter'
import type { OrganisationUnit } from '../../types/generated'
import { Component as OrgUnitsList } from './List'

const error404 = new FetchError({
    type: 'unknown',
    message: '404 not found',
    details: { httpStatusCode: 404 } as FetchError['details'],
})

const defaultUserDataStoreData = () => Promise.reject(new FetchError(error404))

const deleteOrgUnitMock = jest.fn()
const renderList = async ({
    rootOrgUnits = [testOrgUnit()] as Partial<OrganisationUnit>[],
    otherOrgUnits = [] as Partial<OrganisationUnit>[],
    userDataStore = defaultUserDataStoreData,
}) => {
    const routeOptions = {
        handle: { section: SECTIONS_MAP.organisationUnit },
    }

    const organisationUnits = [...otherOrgUnits, ...rootOrgUnits]

    useSchemaStore.getState().setSchemas({
        organisationUnit: organisationUnitsSchemaMock,
    } as unknown as ModelSchemas)

    useCurrentUserStore.getState().setCurrentUser({
        organisationUnits: rootOrgUnits as OrganisationUnit[],
        authorities: new Set(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        settings: {},
    })

    const result = render(
        <TestComponentWithRouter
            path="/organisationUnits"
            customData={{
                organisationUnits: (type: any, params: any) => {
                    if (type === 'read') {
                        const regex = /:(\w+)$/
                        const orgUnitFilter =
                            params.params.filter[0].match(regex)[1]
                        const filteredOrgUnits = organisationUnits.filter(
                            (ou) =>
                                ou.id === orgUnitFilter ||
                                ou.parent?.id === orgUnitFilter
                        )
                        return { organisationUnits: filteredOrgUnits }
                    }
                    if (type === 'delete') {
                        deleteOrgUnitMock(params)
                    }
                },
                userDataStore,
            }}
            routeOptions={routeOptions}
        >
            <OrgUnitsList />
        </TestComponentWithRouter>
    )

    await waitForElementToBeRemoved(() =>
        result.queryByTestId('dhis2-uicore-circularloader')
    )
    return result
}

describe('Org Unit List', () => {
    const originalWarn = console.warn
    jest.spyOn(console, 'warn').mockImplementation((value) => {
        if (!value.match(/No server timezone/)) {
            originalWarn(value)
        }
    })

    it('should show evey org unit in the right order', async () => {
        const rootOrg1 = testOrgUnit({ level: 1, childCount: 2 })
        const rootOrg2 = testOrgUnit({ level: 2, childCount: 1 })

        const root1Level2Child1 = testOrgUnit({
            level: 2,
            ancestors: [rootOrg1],
            parentId: rootOrg1.id,
            childCount: 1,
        })
        const root1Level2Child2 = testOrgUnit({
            level: 2,
            ancestors: [rootOrg1],
            parentId: rootOrg1.id,
            childCount: 0,
        })
        const root1Level3Child1 = testOrgUnit({
            level: 3,
            ancestors: [rootOrg1, root1Level2Child1],
            parentId: root1Level2Child1.id,
            childCount: 0,
        })
        const root2Level3Child = testOrgUnit({
            level: 3,
            ancestors: [rootOrg2],
            parentId: rootOrg2.id,
            childCount: 0,
        })

        const screen = await renderList({
            rootOrgUnits: [rootOrg1, rootOrg2],
            otherOrgUnits: [
                root1Level2Child1,
                root1Level2Child2,
                root1Level3Child1,
                root2Level3Child,
            ],
        })

        const tableRows = screen.getAllByTestId('dhis2-uicore-datatablerow')
        expect(tableRows.length).toBe(6)

        expect(tableRows[0]).toHaveTextContent('Name')
        expect(tableRows[0]).toHaveTextContent('Id')
        expect(tableRows[0]).toHaveTextContent('Code')
        expect(tableRows[0]).toHaveTextContent('Last updated')
        expect(tableRows[0]).toHaveTextContent('Actions')

        expect(tableRows[1]).toHaveTextContent(rootOrg1.displayName!)
        expect(tableRows[1]).toHaveTextContent(rootOrg1.id!)
        expect(tableRows[1]).toHaveTextContent(rootOrg1.code!)
        expect(tableRows[1]).toHaveTextContent(
            getRelativeTime(new Date(rootOrg1.lastUpdated!))
        )

        expect(tableRows[2]).toHaveTextContent(root1Level2Child1.displayName!)
        expect(tableRows[2]).toHaveTextContent(root1Level2Child1.id!)
        expect(tableRows[2]).toHaveTextContent(root1Level2Child1.code!)
        expect(tableRows[2]).toHaveTextContent(
            getRelativeTime(new Date(root1Level2Child1.lastUpdated!))
        )

        expect(tableRows[3]).toHaveTextContent(root1Level2Child2.displayName!)
        expect(tableRows[3]).toHaveTextContent(root1Level2Child2.id!)
        expect(tableRows[3]).toHaveTextContent(root1Level2Child2.code!)
        expect(tableRows[3]).toHaveTextContent(
            getRelativeTime(new Date(root1Level2Child2.lastUpdated!))
        )

        expect(tableRows[4]).toHaveTextContent(rootOrg2.displayName!)
        expect(tableRows[4]).toHaveTextContent(rootOrg2.id!)
        expect(tableRows[4]).toHaveTextContent(rootOrg2.code!)
        expect(tableRows[4]).toHaveTextContent(
            getRelativeTime(new Date(rootOrg2.lastUpdated!))
        )

        expect(tableRows[5]).toHaveTextContent(root2Level3Child.displayName!)
        expect(tableRows[5]).toHaveTextContent(root2Level3Child.id!)
        expect(tableRows[5]).toHaveTextContent(root2Level3Child.code!)
        expect(tableRows[5]).toHaveTextContent(
            getRelativeTime(new Date(root2Level3Child.lastUpdated!))
        )
    })

    it('should collapse visible tree nodes', async () => {
        const rootOrg1 = testOrgUnit({ level: 1, childCount: 2 })
        const rootOrg2 = testOrgUnit({ level: 2, childCount: 1 })

        const root1Level2Child1 = testOrgUnit({
            level: 2,
            ancestors: [rootOrg1],
            parentId: rootOrg1.id,
            childCount: 1,
        })
        const root1Level2Child2 = testOrgUnit({
            level: 2,
            ancestors: [rootOrg1],
            parentId: rootOrg1.id,
            childCount: 0,
        })
        const root1Level3Child1 = testOrgUnit({
            level: 3,
            ancestors: [rootOrg1, root1Level2Child1],
            parentId: root1Level2Child1.id,
            childCount: 0,
        })
        const root2Level3Child = testOrgUnit({
            level: 3,
            ancestors: [rootOrg2],
            parentId: rootOrg2.id,
            childCount: 0,
        })

        const screen = await renderList({
            rootOrgUnits: [rootOrg1, rootOrg2],
            otherOrgUnits: [
                root1Level2Child1,
                root1Level2Child2,
                root1Level3Child1,
                root2Level3Child,
            ],
        })

        const tableRows = screen.getAllByTestId('dhis2-uicore-datatablerow')
        expect(tableRows.length).toBe(6)

        const rootOrg2Row = tableRows[4]
        const rootOrg2RowExpandIcon =
            within(rootOrg2Row).getByTestId('row-expand-icon')
        fireEvent.click(rootOrg2RowExpandIcon)

        const tableRowsRefreshed = await screen.findAllByTestId(
            'dhis2-uicore-datatablerow'
        )
        expect(tableRowsRefreshed.length).toBe(5)

        expect(tableRows[1]).toHaveTextContent(rootOrg1.displayName!)
        expect(tableRows[2]).toHaveTextContent(root1Level2Child1.displayName!)
        expect(tableRows[3]).toHaveTextContent(root1Level2Child2.displayName!)
        expect(tableRows[4]).toHaveTextContent(rootOrg2.displayName!)
    })

    it('should expand a node tree', async () => {
        const rootOrg1 = testOrgUnit({ level: 1, childCount: 2 })
        const rootOrg2 = testOrgUnit({ level: 2, childCount: 1 })

        const root1Level2Child1 = testOrgUnit({
            level: 2,
            ancestors: [rootOrg1],
            parentId: rootOrg1.id,
            childCount: 1,
        })
        const root1Level2Child2 = testOrgUnit({
            level: 2,
            ancestors: [rootOrg1],
            parentId: rootOrg1.id,
            childCount: 0,
        })
        const root1Level3Child1 = testOrgUnit({
            level: 3,
            ancestors: [rootOrg1, root1Level2Child1],
            parentId: root1Level2Child1.id,
            childCount: 0,
        })
        const root2Level3Child = testOrgUnit({
            level: 3,
            ancestors: [rootOrg2],
            parentId: rootOrg2.id,
            childCount: 0,
        })

        const screen = await renderList({
            rootOrgUnits: [rootOrg1, rootOrg2],
            otherOrgUnits: [
                root1Level2Child1,
                root1Level2Child2,
                root1Level3Child1,
                root2Level3Child,
            ],
        })

        const tableRows = screen.getAllByTestId('dhis2-uicore-datatablerow')
        expect(tableRows.length).toBe(6)

        const root1Level2Child1Row = tableRows[2]
        const rootOrg2RowExpandIcon =
            within(root1Level2Child1Row).getByTestId('row-expand-icon')
        fireEvent.click(rootOrg2RowExpandIcon)

        let tableRowsRefreshed: any = []
        await waitFor(() => {
            tableRowsRefreshed = screen.getAllByTestId(
                'dhis2-uicore-datatablerow'
            )
            expect(tableRowsRefreshed.length).toBe(7)
        })

        expect(tableRowsRefreshed[1]).toHaveTextContent(rootOrg1.displayName!)
        expect(tableRowsRefreshed[2]).toHaveTextContent(
            root1Level2Child1.displayName!
        )
        expect(tableRowsRefreshed[3]).toHaveTextContent(
            root1Level3Child1.displayName!
        )
        expect(tableRowsRefreshed[4]).toHaveTextContent(
            root1Level2Child2.displayName!
        )
        expect(tableRowsRefreshed[5]).toHaveTextContent(rootOrg2.displayName!)
        expect(tableRowsRefreshed[6]).toHaveTextContent(
            root2Level3Child.displayName!
        )
    })

    it('should show a clickable delete action when org unit can be deleted', async () => {
        const rootOrg = testOrgUnit({
            level: 1,
            childCount: 0,
            access: testAccess({ deleteAccess: true }),
        })

        const screen = await renderList({
            rootOrgUnits: [rootOrg],
        })

        const tableRows = screen.getAllByTestId('dhis2-uicore-datatablerow')
        expect(tableRows.length).toBe(2)

        expect(tableRows[1]).toHaveTextContent(rootOrg.displayName!)
        const actionButton = within(tableRows[1]).getByTestId(
            'row-actions-menu-button'
        )
        fireEvent.click(actionButton)
        const actionsMenu = screen.getByTestId('row-actions-menu')
        expect(actionsMenu).toBeVisible()
        expect(
            within(actionsMenu).getByText('Delete').closest('li')
        ).not.toHaveClass('disabled')
    })

    it('should show a disabled delete action when org unit can not be deleted', async () => {
        const rootOrg = testOrgUnit({
            level: 1,
            childCount: 0,
            access: testAccess({ deleteAccess: false }),
        })

        const screen = await renderList({
            rootOrgUnits: [rootOrg],
        })

        const tableRows = screen.getAllByTestId('dhis2-uicore-datatablerow')
        expect(tableRows.length).toBe(2)

        expect(tableRows[1]).toHaveTextContent(rootOrg.displayName!)
        const actionButton = within(tableRows[1]).getByTestId(
            'row-actions-menu-button'
        )
        fireEvent.click(actionButton)
        const actionsMenu = screen.getByTestId('row-actions-menu')
        expect(actionsMenu).toBeVisible()
        expect(
            within(actionsMenu).getByText('Delete').closest('li')
        ).toHaveClass('disabled')
    })

    it('delete an org unit when possible', async () => {
        const rootOrg = testOrgUnit({ level: 1, childCount: 2 })
        const child1 = testOrgUnit({
            level: 2,
            ancestors: [rootOrg],
            parentId: rootOrg.id,
            childCount: 0,
            access: testAccess({ deleteAccess: true }),
        })
        const child2 = testOrgUnit({
            level: 2,
            ancestors: [rootOrg],
            parentId: rootOrg.id,
            childCount: 0,
        })

        const screen = await renderList({
            rootOrgUnits: [rootOrg],
            otherOrgUnits: [child1, child2],
        })

        const tableRows = screen.getAllByTestId('dhis2-uicore-datatablerow')
        expect(tableRows.length).toBe(4)

        expect(tableRows[2]).toHaveTextContent(child1.displayName!)
        const actionButton = within(tableRows[2]).getByTestId(
            'row-actions-menu-button'
        )
        fireEvent.click(actionButton)
        const actionsMenu = screen.getByTestId('row-actions-menu')
        expect(actionsMenu).toBeVisible()
        fireEvent.click(within(actionsMenu).getByText('Delete'))

        const deleteConfirmationModal = await screen.findByTestId(
            'delete-confirmation-modal'
        )
        expect(deleteConfirmationModal).toBeVisible()

        fireEvent.click(
            within(deleteConfirmationModal).getByRole('button', {
                name: 'Confirm deletion',
            })
        )
        await waitFor(() => {
            expect(deleteOrgUnitMock).toHaveBeenCalledWith(
                expect.objectContaining({ id: child1.id })
            )
        })
    })

    it('has a link to an org unit edit page in the row actions menu', async () => {
        const rootOrg = testOrgUnit({
            level: 1,
            childCount: 2,
            access: testAccess({ deleteAccess: true }),
        })
        const child1 = testOrgUnit({
            level: 2,
            ancestors: [rootOrg],
            parentId: rootOrg.id,
            childCount: 0,
            access: testAccess({ deleteAccess: true }),
        })
        const child2 = testOrgUnit({
            level: 2,
            ancestors: [rootOrg],
            parentId: rootOrg.id,
            childCount: 0,
        })

        const screen = await renderList({
            rootOrgUnits: [rootOrg],
            otherOrgUnits: [child1, child2],
        })

        expect(screen.queryByText('Organisation unit management')).toBeVisible()

        const tableRows = screen.getAllByTestId('dhis2-uicore-datatablerow')
        expect(tableRows.length).toBe(4)

        expect(tableRows[2]).toHaveTextContent(child1.displayName!)
        const actionButton = within(tableRows[2]).getByTestId(
            'row-actions-menu-button'
        )
        fireEvent.click(actionButton)
        const actionsMenu = screen.getByTestId('row-actions-menu')
        expect(actionsMenu).toBeVisible()
        expect(
            within(actionsMenu).getByText('Edit').closest('a')
        ).toHaveAttribute('href', `/organisationUnits/${child1.id}`)
    })

    it('has a link to an org unit edit page outside the action menu', async () => {
        const rootOrg = testOrgUnit({
            level: 1,
            childCount: 2,
            access: testAccess({ deleteAccess: true }),
        })
        const child1 = testOrgUnit({
            level: 2,
            ancestors: [rootOrg],
            parentId: rootOrg.id,
            childCount: 0,
            access: testAccess({ deleteAccess: true }),
        })
        const child2 = testOrgUnit({
            level: 2,
            ancestors: [rootOrg],
            parentId: rootOrg.id,
            childCount: 0,
        })

        const screen = await renderList({
            rootOrgUnits: [rootOrg],
            otherOrgUnits: [child1, child2],
        })

        expect(screen.queryByText('Organisation unit management')).toBeVisible()

        const tableRows = screen.getAllByTestId('dhis2-uicore-datatablerow')
        expect(tableRows.length).toBe(4)

        expect(tableRows[2]).toHaveTextContent(child1.displayName!)
        const actionCell = within(tableRows[2]).getByTestId('row-actions')
        const links = within(actionCell).getAllByRole('link')
        expect(links[0]).toHaveAttribute(
            'href',
            `/organisationUnits/${child1.id}`
        )
    })
})