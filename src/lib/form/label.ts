import i18n from '@dhis2/d2-i18n'

/**
 *  Utility function to get the required label.
 *
 * Note that label should already be translated
 */
export const getRequiredLabel = (label: string) => {
    return i18n.t('{{label}} (required)', { label })
}
