export const hasUserAuthorityForSection = (authorities, permissions) =>
    permissions.some(permission => authorities.indexOf(permission) !== -1)
