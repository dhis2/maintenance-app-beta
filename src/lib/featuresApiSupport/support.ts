export const FEATURES = Object.freeze({
    searchPerformance: 'searchPerformance',
    validationStrategy: 'validationStrategy',
    programRuleActionPriority: 'programRuleActionPriority',
} as const)

const MINOR_VERSION_SUPPORT = Object.freeze({
    [FEATURES.searchPerformance]: 43,
    [FEATURES.validationStrategy]: 42,
    [FEATURES.programRuleActionPriority]: 43, // temp
} as Record<string, number>)

export const hasAPISupportForFeature = (
    minorVersion: string | number,
    featureName: string
): boolean => {
    const requiredVersion = MINOR_VERSION_SUPPORT[featureName]
    return requiredVersion <= Number(minorVersion) || false
}
