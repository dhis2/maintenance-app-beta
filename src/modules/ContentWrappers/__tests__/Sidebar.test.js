import { MenuItem } from '@dhis2/ui-core'
import { useSelector } from 'react-redux'
import { mount } from 'enzyme'
import React from 'react'

import { Sidebar } from '../Sidebar'
import { getSchemasData, getUserAuthoritiesData } from '../../../redux'

jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(() => ({ pathname: '/irrelevant' })),
    useHistory: jest.fn(() => ({ push: jest.fn() })),
}))

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
    bar: {
        authorities: [
            { type: 'CREATE_PUBLIC', authorities: ['F_BAR_CREATE_PUBLIC'] },
            { type: 'CREATE_PRIVATE', authorities: ['F_BAR_CREATE_PRIVATE'] },
        ],
    },
}

const sections = [
    {
        name: 'Foo',
        path: '/list/fooSection/foo',
        description: 'Foo description',
        schemaName: 'foo',
    },
    {
        name: 'Bar',
        path: '/list/fooSection/bar',
        description: 'Bar description',
        schemaName: 'bar',
    },
    {
        name: 'Foo bar',
        path: '/list/fooSection/fooBar',
        description: 'Foo bar description',
        permissions: [['F_FOO_BAR_CREATE_PUBLIC']],
    },
    {
        name: 'Bar baz',
        path: '/list/fooSection/barBaz',
        description: 'Bar baz description',
        permissions: [['F_BAR_BAZ_CREATE_PUBLIC']],
    },
]

describe('Sidebar', () => {
    describe('a schema exists', () => {
        it('should render a menu item for each section the user has the permissions for', () => {
            useSelector.mockImplementation(selector => {
                if (selector === getUserAuthoritiesData)
                    return ['F_FOO_CREATE_PUBLIC', 'F_FOO_BAR_CREATE_PUBLIC']

                if (selector === getSchemasData) return schemas
            })

            const sidebar = mount(<Sidebar sections={sections} />)
            const menuItems = sidebar.find(MenuItem)

            expect(menuItems).toHaveLength(2)
        })
    })
})
