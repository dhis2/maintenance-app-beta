import i18n from '@dhis2/d2-i18n'

const TRANSLATED_PROPERTY: Record<string, string> = {
    aggregationType: i18n.t('Aggregation type'),
    categoryCombo: i18n.t('Category combination'),
    categoryOption: i18n.t('Category option'),
    code: i18n.t('Code'),
    createdBy: i18n.t('Created by'),
    description: i18n.t('Description'),
    favorite: i18n.t('Favorite'),
    formName: i18n.t('Form name'),
    href: i18n.t('API URL'),
    id: i18n.t('Id'),
    lastUpdatedBy: i18n.t('Last updated by'),
    created: i18n.t('Created'),
    domainType: i18n.t('Domain type'),
    formType: i18n.t('Form type'),
    dataSet: i18n.t('Data set'),
    lastUpdated: i18n.t('Last updated'),
    name: i18n.t('Name'),
    sharing: i18n.t('Sharing'),
    shortName: i18n.t('Short name'),
    valueType: i18n.t('Value type'),
    user: i18n.t('Owner'), // user refers to the owner of the object
    zeroIsSignificant: i18n.t('Zero is significant'),
    dataDimensionType: i18n.t('Data dimension type'),
    ignoreApproval: i18n.t('Ignore data approval'),
}

const camelCaseToSentenceCase = (camelCase: string) =>
    camelCase
        .replace(/([A-Z])/g, (str) => ` ${str.toLowerCase()}`)
        .replace(/^./, (str) => str.toUpperCase())

const markNotTranslated = (property: string) =>
    `** ${camelCaseToSentenceCase(property)} **`

export const getTranslatedProperty = (property: string) => {
    if (i18n.exists(property)) {
        return i18n.t(property)
    }
    if (property in TRANSLATED_PROPERTY) {
        return TRANSLATED_PROPERTY[property]
    }
    return markNotTranslated(property)
}
