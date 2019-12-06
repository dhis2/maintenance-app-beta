import { Tab } from '@dhis2/ui-core'
import { useSelector } from 'react-redux'
import { shallow, mount } from 'enzyme'
import { useHistory, useRouteMatch } from 'react-router-dom'
import React from 'react'

import { NavigationLink } from '../NavigationLink'
import {
    getSchemasData,
    getSystemSettingsData,
    getUserAuthoritiesData,
} from '../../../redux'

jest.unmock('react')
React.useCallback = jest.fn()

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
    useRouteMatch: jest.fn(() => ({ params: { group: 'Foo' } })),
}))

const group = {
    key: 'foo',
    name: 'Foo',
    sections: [
        {
            name: 'FooBar',
            path: '/fooBar',
            description: 'FooBar description',
            schemaName: 'fooBar',
        },
    ],
}

const schemas = {
    fooBar: {
        authorities: [
            {
                type: 'CREATE',
                authorities: ['F_CREATE_FOO'],
            },
            {
                type: 'DELETE',
                authorities: ['F_DELETE_FOO'],
            },
        ],
    },
}

const mockUserHasAuthority = () => {
    useSelector.mockImplementation(selector => {
        if (selector === getSchemasData) {
            return schemas
        }

        if (selector === getUserAuthoritiesData) {
            return ['F_CREATE_FOO']
        }

        if (selector === getSystemSettingsData) {
            return { keyRequireAddToView: true }
        }
    })
}

const mockUserDoesNotHaveAuthority = () => {
    useSelector.mockImplementation(selector => {
        if (selector === getSchemasData) {
            return schemas
        }

        if (selector === getUserAuthoritiesData) {
            return []
        }

        if (selector === getSystemSettingsData) {
            return { keyRequireAddToView: true }
        }
    })
}

describe('NavigationLink', () => {
    it('should render a tab when user has authority for group', () => {
        mockUserHasAuthority()

        const navigationLink = shallow(
            <NavigationLink
                id="irrelevant"
                to="/irrelevant"
                label="Irrelevant"
                group={group}
            />
        )
        const tab = navigationLink.find(Tab)

        expect(tab).toHaveLength(1)
    })

    it('should not render a tab when user does not have the authority for group', () => {
        mockUserDoesNotHaveAuthority()

        const navigationLink = shallow(
            <NavigationLink
                id="irrelevant"
                to="/irrelevant"
                label="Irrelevant"
                group={group}
            />
        )
        const tab = navigationLink.find(Tab)

        expect(tab).toHaveLength(0)
    })

    it('should render a tab when user does not have the authority for group but noAuthis true', () => {
        mockUserDoesNotHaveAuthority()

        const navigationLink = shallow(
            <NavigationLink
                noAuth
                id="irrelevant"
                to="/irrelevant"
                label="Irrelevant"
                group={group}
            />
        )
        const tab = navigationLink.find(Tab)

        expect(tab).toHaveLength(1)
    })

    it("should pass selected={true} to the tab when the id matches the route's group", () => {
        mockUserHasAuthority()

        useRouteMatch.mockImplementationOnce(() => ({
            params: { group: 'Foo' },
        }))

        const navigationLink = shallow(
            <NavigationLink
                id="Foo"
                to="/irrelevant"
                label="Irrelevant"
                group={group}
            />
        )
        const tab = navigationLink.find(Tab)
        const tabProps = tab.props()
        const isTabSelected = tabProps.selected

        expect(isTabSelected).toBe(true)
    })

    it("should pass selected={false} to the tab when the id does not matche the route's group", () => {
        mockUserHasAuthority()

        useRouteMatch.mockImplementationOnce(() => ({
            params: { group: 'Bar' },
        }))

        const navigationLink = shallow(
            <NavigationLink
                id="Foo"
                to="/irrelevant"
                label="Irrelevant"
                group={group}
            />
        )
        const tab = navigationLink.find(Tab)
        const tabProps = tab.props()
        const isTabSelected = tabProps.selected

        expect(isTabSelected).toBe(false)
    })

    it('should push the path when the tab is clicked and not disabled', () => {
        mockUserHasAuthority()

        const path = '/fooPath'
        const push = jest.fn()
        useHistory.mockImplementationOnce(() => ({ push }))

        const navigationLink = mount(
            <NavigationLink
                disabled={false}
                id="Foo"
                to={path}
                label="Irrelevant"
                group={group}
            />
        )
        const button = navigationLink.find('button')
        button.simulate('click')

        expect(push).toBeCalledTimes(1)
        expect(push).toBeCalledWith(path)
    })

    it('should not push and prevent the default the path when the tab is clicked and disabled', () => {
        mockUserHasAuthority()

        const path = '/fooPath'
        const push = jest.fn()
        const preventDefault = jest.fn()
        useHistory.mockImplementationOnce(() => ({ push }))

        const navigationLink = mount(
            <NavigationLink
                disabled
                id="Foo"
                to={path}
                label="Irrelevant"
                group={group}
            />
        )
        const button = navigationLink.find('button')
        button.simulate('click', { preventDefault })

        expect(push).toBeCalledTimes(0)
        expect(preventDefault).toBeCalledTimes(1)
    })
})
