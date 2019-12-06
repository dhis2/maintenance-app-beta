import { MenuItem } from '@dhis2/ui-core'
import { useSelector } from 'react-redux'
import React from 'react'

import { mount } from 'enzyme'

import { FolderClosed } from '../../../icons/FolderClosed'
import { SidebarMenuItem } from '../SidebarMenuItem'
import { getSchemasData, getUserAuthoritiesData } from '../../../../redux'

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}))

const schemas = {
    foo: {
        authorities: [
            { type: 'CREATE_PUBLIC', authorities: ['F_FOO_CREATE_PUBLIC'] },
            { type: 'CREATE_PRIVATE', authorities: ['F_FOO_CREATE_PRIVATE'] },
        ],
    },
}

describe('SidebarMenuItem', () => {
    const label = 'Foo'
    const onClick = jest.fn()

    describe('a schema exists', () => {
        const permissions = []
        const schemaName = 'foo'

        it('should render when the user has the required privileges', () => {
            useSelector.mockImplementation(selector => {
                if (selector === getUserAuthoritiesData)
                    return ['F_FOO_CREATE_PUBLIC']
                if (selector === getSchemasData) return schemas
            })

            const item = mount(
                <SidebarMenuItem
                    label={label}
                    icon={<FolderClosed />}
                    permissions={permissions}
                    schemaName={schemaName}
                    active={false}
                    onClick={onClick}
                />
            )

            const menuItem = item.find(MenuItem)
            expect(menuItem).toHaveLength(1)
        })

        it('should not render when the user has the required privileges', () => {
            useSelector.mockImplementation(selector => {
                if (selector === getUserAuthoritiesData)
                    return ['F_FOO_DELETE_PRIVATE']
                if (selector === getSchemasData) return schemas
            })

            const item = mount(
                <SidebarMenuItem
                    label={label}
                    icon={<FolderClosed />}
                    permissions={permissions}
                    schemaName={schemaName}
                    active={false}
                    onClick={onClick}
                />
            )

            const menuItem = item.find(MenuItem)
            expect(menuItem).toHaveLength(0)
        })
    })

    describe('a schema does not exist', () => {
        const permissions = [['F_FOO_CREATE_PUBLIC']]
        const schemaName = ''

        it('should render when the user has the required privileges', () => {
            useSelector.mockImplementation(selector => {
                if (selector === getUserAuthoritiesData)
                    return ['F_FOO_CREATE_PUBLIC']
                if (selector === getSchemasData) return {}
            })

            const item = mount(
                <SidebarMenuItem
                    label={label}
                    icon={<FolderClosed />}
                    permissions={permissions}
                    schemaName={schemaName}
                    active={false}
                    onClick={onClick}
                />
            )

            const menuItem = item.find(MenuItem)
            expect(menuItem).toHaveLength(1)
        })

        it('should not render when the user has the required privileges', () => {
            useSelector.mockImplementation(selector => {
                if (selector === getUserAuthoritiesData)
                    return ['F_FOO_CREATE_PRIVATE']
                if (selector === getSchemasData) return {}
            })

            const item = mount(
                <SidebarMenuItem
                    label={label}
                    icon={<FolderClosed />}
                    permissions={permissions}
                    schemaName={schemaName}
                    active={false}
                    onClick={onClick}
                />
            )

            const menuItem = item.find(MenuItem)
            expect(menuItem).toHaveLength(0)
        })
    })
})
