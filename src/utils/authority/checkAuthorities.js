export const checkAuthorities = (requiredAuthorities, givenAuthorities) =>
    !!givenAuthorities.find(authority => authority === 'ALL') ||
    requiredAuthorities.reduce(
        (authorized, requiredAuthority) =>
            authorized ||
            requiredAuthority.some(
                reqAuth => givenAuthorities.indexOf(reqAuth) !== -1
            ),
        false
    )
