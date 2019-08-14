export const hasAuthority = (requiredAuthorities, givenAuthorities) =>
    requiredAuthorities.reduce(
        (authorized, requiredAuthority) =>
            authorized ||
            requiredAuthority.some(
                reqAuth => givenAuthorities.indexOf(reqAuth) !== -1
            ),
        false
    )
