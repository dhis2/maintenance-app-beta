import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect } from 'react'
import type { MeDto } from '../types/'
import type { ModelSchemas, PickSchemaProperties } from './schemas'
import { useSetSchemas } from './schemas'
import { useSetCurrentUser } from './user/currentUserStore'

export const schemaPropertyFields = [
    'authorities',
    'displayName',
    'name',
    'plural',
    'translatable',
    'properties',
] as const

// workaround to widen the type, because useQuery() does not allow for
// readonly types
const schemaFields = schemaPropertyFields.concat()

export type SchemaPropertyFields = (typeof schemaPropertyFields)[number]
export type Schemas = ModelSchemas<SchemaPropertyFields>
type Schema = PickSchemaProperties<SchemaPropertyFields>

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
const currentUserFields = userFields.concat()

type UserPropertyFields = (typeof userFields)[number]
type CurrentUserResponse = Pick<MeDto, UserPropertyFields>

export interface CurrentUser {
    authorities: Set<string> // use a set for faster lookup
}

const query = {
    schemas: {
        resource: 'schemas',
        params: {
            fields: schemaFields,
        },
    },
    currentUser: {
        resource: 'me',
        params: {
            fields: currentUserFields.concat(),
        },
    },
}

interface ModelSchemaResponse {
    schemas: {
        schemas: Schema[]
    }
    currentUser: CurrentUserResponse
}

export const useLoadApp = () => {
    const queryResponse = useDataQuery<ModelSchemaResponse>(query)
    const setSchemas = useSetSchemas()
    const setCurrentUser = useSetCurrentUser()

    useEffect(() => {
        if (queryResponse.data) {
            const schemaResponse = queryResponse.data
            const schemas = schemaResponse.schemas.schemas

            const modelSchemas = Object.fromEntries(
                schemas.map((schema) => [schema.name, schema])
            ) as Schemas

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
