export const FEATURES = Object.freeze({
    trigramIndexable: 'trigramIndexable',
} as const)

const MINOR_VERSION_SUPPORT = Object.freeze({
    [FEATURES.trigramIndexable]: 43,
} as Record<string, number>)

export const hasAPISupportForFeature = (
    minorVersion: string | number,
    featureName: string
): boolean => {
    const requiredVersion = MINOR_VERSION_SUPPORT[featureName]
    return requiredVersion <= Number(minorVersion) || false
}
