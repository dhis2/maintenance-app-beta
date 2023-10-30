import { useDataQuery } from '@dhis2/app-runtime'
import type { ModelSchemasBase, PickSchemaProperties } from '../types'
import type {
    CurrentUser as CurrentUserBase,
    SystemSettings,
} from '../types/models'
import { useSetSchemas } from './schemas'
import { useSetSystemSettings } from './systemSettings'
import { useSetCurrentUser } from './user'

const schemaFields = [
    'authorities',
    'displayName',
    'name',
    'plural',
    'singular',
    'translatable',
    'properties',
] as const

// workaround to widen the type, because useQuery() does not allow for
// readonly types (even though it should)
const schemaFieldsFilter = schemaFields.concat()

type SchemaPropertyFields = (typeof schemaFieldsFilter)[number]
export type Schema = PickSchemaProperties<SchemaPropertyFields>
export type ModelSchemas = ModelSchemasBase<Schema>

// same fields as headbar-request to hit the cache
const userFields = [
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

/**
 * !!! WARNING !!!
 * This should not be used in production code! If we need it, then we should
 * rename it as there's already a `CurrentUser` type exported from the
 * generated schema types
 */
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
    systemSettings: {
        resource: 'systemSettings',
    },
}

// properties are returned as an array, but we map them by fieldName
type SchemaResponse = Omit<Schema, 'properties'> & {
    properties: Schema['properties'][number][]
}

interface QueryResponse {
    schemas: {
        schemas: SchemaResponse[]
    }
    currentUser: CurrentUserResponse
    systemSettings: SystemSettings
}

const formatSchema = (schema: SchemaResponse): Schema => {
    const propEntries = schema.properties.map((prop) => [prop.fieldName, prop])
    const mappedProperties = Object.fromEntries(propEntries)
    return {
        ...schema,
        properties: mappedProperties,
    }
}

export const useLoadApp = () => {
    const setSchemas = useSetSchemas()
    const setCurrentUser = useSetCurrentUser()
    const setSystemSettings = useSetSystemSettings()

    const queryResponse = useDataQuery<QueryResponse>(query, {
        onComplete: (queryData) => {
            try {
                const schemas = queryData.schemas.schemas

                const schemaEntries = schemas.map((schema) => [
                    schema.singular,
                    formatSchema(schema),
                ])
                const modelSchemas: ModelSchemas =
                    Object.fromEntries(schemaEntries)

                const currentUserResponse = queryData.currentUser
                const currentUser: CurrentUser = {
                    ...currentUserResponse,
                    authorities: new Set(currentUserResponse.authorities),
                }
                setSchemas(modelSchemas)
                setCurrentUser(currentUser)
                setSystemSettings(queryData.systemSettings)
            } catch (e) {
                console.log('Failed to load app', e)
            }
        },
    })
    return queryResponse
}
