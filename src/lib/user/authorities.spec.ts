import { expect } from '@jest/globals'
import { SchemaAuthorities, SchemaAuthorityType } from '../../types'
import { Schema } from '../useLoadApp'
import {
    canCreate,
    hasAuthorityForOperation,
    ALL_AUTHORITY,
} from './authorities'

describe('hasAuthorityForOperation', () => {
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
        const allowed = hasAuthorityForOperation(
            SchemaAuthorityType.CREATE_PUBLIC,
            dataElementSchemaAuthorities,
            userAuthorities
        )

        expect(allowed).toBe(true)
    })

    it('should return true if user has the ALL authority', () => {
        const userAuthorities = new Set([ALL_AUTHORITY])
        const allowed = hasAuthorityForOperation(
            SchemaAuthorityType.CREATE,
            dataElementSchemaAuthorities,
            userAuthorities
        )
        expect(allowed).toBe(true)
    })

    it('should return true if operation is CREATE, and the schema has CREATE_PUBLIC', () => {
        const userAuthorities = new Set(['F_DATAELEMENT_PUBLIC_ADD'])
        const allowed = hasAuthorityForOperation(
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
        const allowed = hasAuthorityForOperation(
            SchemaAuthorityType.CREATE,
            dataElementSchemaAuthorities,
            userAuthorities
        )
        expect(allowed).toBe(true)
    })

    it('should return false if the user does not have the required authorities', () => {
        const userAuthorities = new Set(['F_PROGRAM_PRIVATE_ADD'])
        const allowed = hasAuthorityForOperation(
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
        const allowed = hasAuthorityForOperation(
            SchemaAuthorityType.DELETE,
            dataElementSchemaAuthorities,
            userAuthorities
        )
        expect(allowed).toBe(false)
    })

    it('should return false if userAuthorities is empty', () => {
        const userAuthorities = new Set([])
        const dataElementSchemaAuthorities: SchemaAuthorities = [
            {
                type: SchemaAuthorityType.CREATE_PRIVATE,
                authorities: ['F_DATAELEMENT_PRIVATE_ADD'],
            },
        ]
        const allowed = hasAuthorityForOperation(
            SchemaAuthorityType.DELETE,
            dataElementSchemaAuthorities,
            userAuthorities
        )
        expect(allowed).toBe(false)
    })

    it('should return false if schemaAuthorities is empty', () => {
        const userAuthorities = new Set([])
        const allowed = hasAuthorityForOperation(
            SchemaAuthorityType.DELETE,
            [],
            userAuthorities
        )
        expect(allowed).toBe(false)
    })

    describe('canCreate', () => {
        // note that this is a partial schema, with relevant properties
        const dataElementSchemaMock = {
            singular: 'dataElement',
            plural: 'dataElements',
            name: 'dataElement',
            displayName: 'Data Element',
            collectionName: 'dataElements',
            authorities: [
                {
                    type: 'CREATE_PUBLIC',
                    authorities: ['F_DATAELEMENT_PUBLIC_ADD'],
                },
                {
                    type: 'CREATE_PRIVATE',
                    authorities: ['F_DATAELEMENT_PRIVATE_ADD'],
                },
                {
                    type: 'DELETE',
                    authorities: ['F_DATAELEMENT_DELETE'],
                },
            ],
        } as unknown as Schema

        it('should return true if the user has the required authorities', () => {
            const userAuthorities = new Set(['F_DATAELEMENT_PRIVATE_ADD'])
            const isAllowed = canCreate(dataElementSchemaMock, userAuthorities)
            expect(isAllowed).toBe(true)
        })

        it('should return true if the user has the ALL authority', () => {
            const userAuthorities = new Set([ALL_AUTHORITY])
            const isAllowed = canCreate(dataElementSchemaMock, userAuthorities)
            expect(isAllowed).toBe(true)
        })

        it('should return false if the user does not have the required authorities', () => {
            const userAuthorities = new Set(['F_DATAELEMENT_DELETE'])
            const isAllowed = canCreate(dataElementSchemaMock, userAuthorities)
            expect(isAllowed).toBe(false)
        })

        it('should return false if the user has no authorities', () => {
            const userAuthorities = new Set([])
            const isAllowed = canCreate(dataElementSchemaMock, userAuthorities)
            expect(isAllowed).toBe(false)
        })

        it('should return false if schema is categoryOptionCombo', () => {
            const categoryOptionComboSchemaMock = {
                singular: 'dataElement',
                plural: 'dataElements',
                name: 'dataElement',
                displayName: 'Data Element',
                collectionName: 'dataElements',
                authorities: [
                    {
                        type: 'CREATE_PUBLIC',
                        authorities: ['F_CATEGORY_COMBO_PUBLIC_ADD'],
                    },
                    {
                        type: 'CREATE_PRIVATE',
                        authorities: ['F_CATEGORY_COMBO_PRIVATE_ADD'],
                    },
                    {
                        type: 'DELETE',
                        authorities: ['F_CATEGORY_COMBO_DELETE'],
                    },
                ],
            } as unknown as Schema

            const userAuthorities = new Set(['F_CATEGORY_COMBO_PRIVATE_ADD'])

            const isAllowed = canCreate(
                categoryOptionComboSchemaMock,
                userAuthorities
            )
            expect(isAllowed).toBe(false)
        })
    })
})
