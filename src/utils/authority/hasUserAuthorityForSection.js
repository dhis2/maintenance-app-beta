import { getAuthoritiesFromSchema } from './getAuthoritiesFromSchema'

export const hasUserAuthorityForSection = ({
    authorities,
    systemSettings,
    schema,
    permissions,
}) => {
    const requiredPrivileges = schema
        ? getAuthoritiesFromSchema(schema)
        : permissions

    return (
        !systemSettings.keyRequireAddToView ||
        requiredPrivileges.some(privileges =>
            privileges.every(privilege => authorities.indexOf(privilege) !== -1)
        )
    )
}
