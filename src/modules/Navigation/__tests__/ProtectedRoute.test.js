import { shallow } from 'enzyme'
import { Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import React from 'react'

import { NoAuthority } from '../../../views'
import { ProtectedRoute } from '../ProtectedRoute'
import {
    getSchemasData,
    getSystemSettingsData,
    getUserAuthoritiesData,
} from '../../../redux'

jest.mock('react-redux', () => ({
    useSelector: jest.fn(() => false),
}))

describe('ProtectedRoute', () => {
    const schemas = {
        foo: {
            authorities: [
                {
                    type: 'CREATE',
                    authorities: ['F_CREATE_FOO'],
                },
            ],
        },
    }
    const Foo = () => <span />
    const section = {
        name: 'Foo',
        path: '/foo',
        description: 'Foo description',
        schemaName: 'foo',
    }

    it('should forward the view component when the user has the required authorities', () => {
        useSelector.mockImplementationOnce(selector => {
            if (selector === getSchemasData) return schemas
            if (selector === getUserAuthoritiesData) return ['F_CREATE_FOO']
            if (selector === getSystemSettingsData)
                return { keyRequireAddToView: true }
        })

        const protectedRoute = shallow(
            <ProtectedRoute component={Foo} section={section} />
        )
        const route = protectedRoute.find(Route)
        const routeProps = route.props()
        const { component } = routeProps

        expect(component).toBe(Foo)
    })

    it('should not forward the view component when the user does not have the required authorities', () => {
        useSelector.mockImplementation(selector => {
            if (selector === getSchemasData) return schemas
            if (selector === getUserAuthoritiesData) return []
            if (selector === getSystemSettingsData)
                return { keyRequireAddToView: true }
        })

        const protectedRoute = shallow(
            <ProtectedRoute component={Foo} section={section} />
        )
        const route = protectedRoute.find(Route)
        const routeProps = route.props()
        const { component } = routeProps

        expect(component).toBe(NoAuthority)
    })
})
