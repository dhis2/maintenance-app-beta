export const hasUserAuthorityForSection = (
    authorities,
    systemSettings,
    permissions
) =>
    !systemSettings.keyRequireAddToView ||
    permissions.some(permission => authorities.indexOf(permission) !== -1)
