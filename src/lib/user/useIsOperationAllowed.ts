import {
    SchemaName,
    SchemaAuthorityType,
    SchemaSection,
    SchemaAuthorities,
} from '../../types'
import { useSchema } from '../schemas'
import { useCurrentUserAuthorities } from './currentUserStore'

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

export const isOperationAllowed = (
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

export const useIsOperationAllowed = (
    section: SchemaSection | SchemaName,
    operation: Operation
) => {
    const modelName = typeof section === 'string' ? section : section.name
    const userAuthorities = useCurrentUserAuthorities()
    const modelSchema = useSchema(modelName)

    return isOperationAllowed(
        operation,
        modelSchema.authorities,
        userAuthorities
    )
}

export const useCanCreate = (
    section: SchemaSection | SchemaName,
    createAuthType: CreateAuthType = SchemaAuthorityType.CREATE
) => {
    return useIsOperationAllowed(section, createAuthType)
}

// note the access.delete property on the target model should also be checked
// before trying to delete a model
// but this can be used to check whether a delete component should be rendered for a section at all
export const useCanDelete = (section: SchemaSection | SchemaName) => {
    return useIsOperationAllowed(section, SchemaAuthorityType.DELETE)
}