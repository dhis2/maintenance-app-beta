import i18n from '@dhis2/d2-i18n'

const TRANSLATED_PROPERTY: Record<string, string> = {
    code: i18n.t('Code'),
    createdBy: i18n.t('Created by'),
    favorite: i18n.t('Favorite'),
    href: i18n.t('Href'),
    id: i18n.t('Id'),
    lastUpdatedBy: i18n.t('Last updated by'),
    created: i18n.t('Created'),
    domainType: i18n.t('Domain type'),
    lastUpdated: i18n.t('Last updated'),
    name: i18n.t('Name'),
    sharing: i18n.t('Sharing'),
    shortName: i18n.t('Short name'),
    valueType: i18n.t('Value type'),
    user: i18n.t('Owner'), // user refers to the owner of the object
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
