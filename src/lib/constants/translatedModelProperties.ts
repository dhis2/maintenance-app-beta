import i18n from '@dhis2/d2-i18n'

const TRANSLATED_PROPERTY: Record<string, string> = {
    aggregationType: i18n.t('Aggregation type'),
    aggregateExportCategoryOptionCombo: i18n.t(
        'Category option combination for aggregate data export'
    ),
    aggregateExportAttributeOptionCombo: i18n.t(
        'Attribute option combination for aggregate data export'
    ),
    analyticsType: i18n.t('Analytics type'),
    category: i18n.t('Category'),
    categoryCombo: i18n.t('Category combination'),
    categoryOption: i18n.t('Category option'),
    code: i18n.t('Code'),
    compulsory: i18n.t('Compulsory'),
    created: i18n.t('Created'),
    createdBy: i18n.t('Created by'),
    dataElement: i18n.t('Data element'),
    dataElementGroup: i18n.t('Data element group'),
    dataElementGroupSet: i18n.t('Data element group set'),
    dataDimension: i18n.t('Data dimension'),
    dataDimensionType: i18n.t('Data dimension type'),
    dataSet: i18n.t('Data set'),
    description: i18n.t('Description'),
    displayInForm: i18n.t('Display in form'),
    domainType: i18n.t('Domain type'),
    expression: i18n.t('Expression'),
    favorite: i18n.t('Favorite'),
    filter: i18n.t('Filter'),
    formName: i18n.t('Form name'),
    formType: i18n.t('Form type'),
    href: i18n.t('API URL'),
    id: i18n.t('Id'),
    ignoreApproval: i18n.t('Ignore data approval'),
    indicatorType: i18n.t('Indicator type'),
    lastUpdated: i18n.t('Last updated'),
    lastUpdatedBy: i18n.t('Last updated by'),
    name: i18n.t('Name'),
    program: i18n.t('Program'),
    sharing: i18n.t('Sharing'),
    shortName: i18n.t('Short name'),
    user: i18n.t('Owner'), // user refers to the owner of the object
    valueType: i18n.t('Value type'),
    zeroIsSignificant: i18n.t('Zero is significant'),
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
