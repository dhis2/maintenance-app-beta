const extractAuthoritiesFromSchema = schema =>
    schema.authorities.reduce(
        (authorities, authority) => [...authorities, ...authority.authorities],
        []
    )

export const hasUserAuthorityForSection = ({
    authorities,
    systemSettings,
    schema,
    permissions,
}) => {
    const requiredPrivileges = schema
        ? extractAuthoritiesFromSchema(schema)
        : permissions

    return (
        !systemSettings.keyRequireAddToView ||
        requiredPrivileges.some(
            privilege => authorities.indexOf(privilege) !== -1
        )
    )
}
