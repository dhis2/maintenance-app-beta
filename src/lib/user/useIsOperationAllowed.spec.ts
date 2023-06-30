import { expect } from '@jest/globals'
import { SchemaAuthorities, SchemaAuthorityType } from './../../types'
import { isOperationAuthorized } from './useIsOperationAllowed'

describe('isOperationAllowed', () => {
    const dataElementSchemaAuthorities: SchemaAuthorities = [
        {
            type: SchemaAuthorityType.CREATE_PUBLIC,
            authorities: ['F_DATAELEMENT_PUBLIC_ADD'],
        },
        {
            type: SchemaAuthorityType.CREATE_PRIVATE,
            authorities: ['F_DATAELEMENT_PRIVATE_ADD'],
        },
        {
            type: SchemaAuthorityType.DELETE,
            authorities: ['F_DATAELEMENT_DELETE'],
        },
    ]
    const userAuthorities = new Set(['F_DATAELEMENT_PUBLIC_ADD'])
    it('should return true if the user has the required authorities', () => {
        const allowed = isOperationAuthorized(
            SchemaAuthorityType.CREATE_PUBLIC,
            dataElementSchemaAuthorities,
            userAuthorities
        )

        expect(allowed).toBe(true)
    })

    it('should return true if user has the ALL authority', () => {
        const userAuthorities = new Set(['ALL'])
        const allowed = isOperationAuthorized(
            SchemaAuthorityType.CREATE,
            dataElementSchemaAuthorities,
            userAuthorities
        )
        expect(allowed).toBe(true)
    })

    it('should return true if operation is CREATE, and the schema has CREATE_PUBLIC', () => {
        const userAuthorities = new Set(['F_DATAELEMENT_PUBLIC_ADD'])
        const allowed = isOperationAuthorized(
            SchemaAuthorityType.CREATE,
            dataElementSchemaAuthorities,
            userAuthorities
        )
        expect(allowed).toBe(true)
    })

    it('should return true if operation is CREATE, and the schema has CREATE_PRIVATE', () => {
        const userAuthorities = new Set(['F_DATAELEMENT_PRIVATE_ADD'])
        const dataElementSchemaAuthorities: SchemaAuthorities = [
            {
                type: SchemaAuthorityType.CREATE_PRIVATE,
                authorities: ['F_DATAELEMENT_PRIVATE_ADD'],
            },
        ]
        const allowed = isOperationAuthorized(
            SchemaAuthorityType.CREATE,
            dataElementSchemaAuthorities,
            userAuthorities
        )
        expect(allowed).toBe(true)
    })

    it('should return false if the user does not have the required authorities', () => {
        const userAuthorities = new Set(['F_PROGRAM_PRIVATE_ADD'])
        const allowed = isOperationAuthorized(
            SchemaAuthorityType.CREATE,
            dataElementSchemaAuthorities,
            userAuthorities
        )
        expect(allowed).toBe(false)
    })

    it('should return false if schema does not have given operation', () => {
        const userAuthorities = new Set(['F_DATAELEMENT_PRIVATE_ADD'])
        const dataElementSchemaAuthorities: SchemaAuthorities = [
            {
                type: SchemaAuthorityType.CREATE_PRIVATE,
                authorities: ['F_DATAELEMENT_PRIVATE_ADD'],
            },
        ]
        const allowed = isOperationAuthorized(
            SchemaAuthorityType.DELETE,
            dataElementSchemaAuthorities,
            userAuthorities
        )
        expect(allowed).toBe(false)
    })
})
