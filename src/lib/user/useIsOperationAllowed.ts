import { SchemaName, SchemaAuthorityType, SchemaSection } from '../../types'
import { useSchema } from '../schemas'
import { useCurrentUserAuthorities } from './currentUserStore'

/* NOTE: read/update are checked using access properties on a model */

// user can create model if they have any of the following authorities
const createAuthTypes = [
    SchemaAuthorityType.CREATE,
    SchemaAuthorityType.CREATE_PRIVATE,
    SchemaAuthorityType.CREATE_PUBLIC,
] as const

const canCreateAuthTypes = new Set<SchemaAuthorityType>(createAuthTypes)
type CreateAuthType = (typeof createAuthTypes)[number]

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
    section: SchemaSection | SchemaName,
    operation: Operation
) => {
    const modelName = typeof section === 'string' ? section : section.name
    const userAuthorities = useCurrentUserAuthorities()
    const modelSchema = useSchema(modelName)

    return isOperationAllowed(operation, modelSchema, userAuthorities)
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
