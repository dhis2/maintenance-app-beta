import i18n from '@dhis2/d2-i18n'

const TRANSLATED_PROPERTY: Record<string, string> = {
    name: i18n.t('Name'),
    shortName: i18n.t('Short name'),
    lastUpdated: i18n.t('Last updated'),
    created: i18n.t('Created'),
    sharing: i18n.t('Sharing'),
    domainType: i18n.t('Domain type'),
    valueType: i18n.t('Value type'),
}

const camelCaseToSentenceCase = (camelCase: string) =>
    camelCase
        .replace(/([A-Z])/g, (str) => ` ${str.toLowerCase()}`)
        .replace(/^./, (str) => str.toUpperCase())

const markNotTranslated = (property: string) =>
    `** ${camelCaseToSentenceCase(property)} **`

export const getTranslatedProperty = (property: string) => {
    if (property in TRANSLATED_PROPERTY) {
        return TRANSLATED_PROPERTY[property]
    }
    return TRANSLATED_PROPERTY[property] || markNotTranslated(property)
}
