import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect } from 'react'
import type { ModelSchemasBase, PickSchemaProperties } from '../types'
import type { CurrentUser as CurrentUserBase } from '../types/models'
import { useSetSchemas } from './schemas'
import { useSetCurrentUser } from './user'

export const schemaFields = [
    'authorities',
    'displayName',
    'name',
    'plural',
    'translatable',
    'properties',
] as const

// workaround to widen the type, because useQuery() does not allow for
// readonly types (even though it should)
const schemaFieldsFilter = schemaFields.concat()

export type SchemaPropertyFields = (typeof schemaFieldsFilter)[number]
export type Schema = PickSchemaProperties<SchemaPropertyFields>
export type ModelSchemas = ModelSchemasBase<Schema>

// same fields as headbar-request to hit the cache
export const userFields = [
    'authorities',
    'avatar',
    'email',
    'name',
    'settings',
] as const
// workaround to widen the type, because useQuery() does not allow for
// readonly types
const userFieldsFilter = userFields.concat()

type UserPropertyFields = (typeof userFields)[number]
type CurrentUserResponse = Pick<CurrentUserBase, UserPropertyFields>

export interface CurrentUser extends Omit<CurrentUserResponse, 'authorities'> {
    authorities: Set<string> // use a set for faster lookup
}

const query = {
    schemas: {
        resource: 'schemas',
        params: {
            fields: schemaFieldsFilter,
        },
    },
    currentUser: {
        resource: 'me',
        params: {
            fields: userFieldsFilter,
        },
    },
}

interface QueryResponse {
    schemas: {
        schemas: Schema[]
    }
    currentUser: CurrentUserResponse
}

export const useLoadApp = () => {
    const queryResponse = useDataQuery<QueryResponse>(query)
    const setSchemas = useSetSchemas()
    const setCurrentUser = useSetCurrentUser()

    useEffect(() => {
        if (queryResponse.data) {
            const schemaResponse = queryResponse.data
            const schemas = schemaResponse.schemas.schemas

            const modelSchemas = Object.fromEntries(
                schemas.map((schema) => [schema.name, schema])
            ) as ModelSchemas

            const currentUserResponse = schemaResponse.currentUser
            const currentUser: CurrentUser = {
                ...currentUserResponse,
                authorities: new Set(currentUserResponse.authorities),
            }

            setSchemas(modelSchemas)
            setCurrentUser(currentUser)
        }
    }, [setSchemas, setCurrentUser, queryResponse.data])

    return queryResponse
}