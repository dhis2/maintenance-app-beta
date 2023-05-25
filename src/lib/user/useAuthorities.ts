import { Section, SchemaName, SchemaAuthorityType } from '../../types'
import { useSchema } from '../schemas'
import { useCurrentUserAuthorities } from './currentUserStore'

/* NOTE: read/update are checked using access properties on a model */

// user can create model if they have any of the following authorities
const canCreateAuthTypes = new Set([
    SchemaAuthorityType.CREATE,
    SchemaAuthorityType.CREATE_PRIVATE,
    SchemaAuthorityType.CREATE_PUBLIC,
])
type CreateAuthType =
    | SchemaAuthorityType.CREATE
    | SchemaAuthorityType.CREATE_PRIVATE
    | SchemaAuthorityType.CREATE_PUBLIC

type Operation = CreateAuthType | SchemaAuthorityType.DELETE

export const isOperationAllowed = (
    operation: Operation,
    schema: ReturnType<typeof useSchema>,
    userAuthorities: Set<string>
) => {
    const authoritiesNeeded = schema.authorities.find((auth) => {
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
    section: Section | SchemaName,
    operation: Operation
) => {
    const modelName = typeof section === 'string' ? section : section.name
    const userAuthorities = useCurrentUserAuthorities()
    const modelSchema = useSchema(modelName)

    return isOperationAllowed(operation, modelSchema, userAuthorities)
}

export const useCanCreate = (
    section: Section | SchemaName,
    createAuthType: CreateAuthType = SchemaAuthorityType.CREATE
) => {
    return useIsOperationAllowed(section, createAuthType)
}

export const useCanDelete = (section: Section | SchemaName) => {
    return useIsOperationAllowed(section, SchemaAuthorityType.DELETE)
}
