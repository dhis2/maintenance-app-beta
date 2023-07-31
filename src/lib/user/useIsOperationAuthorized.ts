import { SchemaAuthorityType, SchemaAuthorities } from '../../types'

/* NOTE: read/update are checked using access properties on a model */

const ALL_AUTHORITY = 'ALL'
// user can create model if they have any of the following authorities
const createAuthTypes = [
    SchemaAuthorityType.CREATE,
    SchemaAuthorityType.CREATE_PRIVATE,
    SchemaAuthorityType.CREATE_PUBLIC,
] as const

const canCreateAuthTypes = new Set<SchemaAuthorityType>(createAuthTypes)
type CreateAuthType = (typeof createAuthTypes)[number]

export type Operation = CreateAuthType | SchemaAuthorityType.DELETE

export const isOperationAuthorized = (
    operation: Operation,
    schemaAuthorities: SchemaAuthorities,
    userAuthorities: Set<string>
) => {
    if (userAuthorities.has(ALL_AUTHORITY)) {
        return true
    }

    const authoritiesNeeded = schemaAuthorities?.find((auth) => {
        // if operation is CREATE it can be any of types in canCreateAuthTypes
        if (operation === SchemaAuthorityType.CREATE) {
            return canCreateAuthTypes.has(auth.type)
        }
        return auth.type === operation
    })?.authorities

    if (!authoritiesNeeded) {
        return false
    }

    return authoritiesNeeded.some((auth) => userAuthorities.has(auth))
}

export const canCreate = (
    schemaAuthorities: SchemaAuthorities,
    userAuthorities: Set<string>
) => {
    return isOperationAuthorized(
        SchemaAuthorityType.CREATE,
        schemaAuthorities,
        userAuthorities
    )
}
