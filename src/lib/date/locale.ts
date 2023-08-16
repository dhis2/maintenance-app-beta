import i18n from '@dhis2/d2-i18n'

// our locales use _ instead of - for locales
const language = i18n.language?.replace('_', '-') || 'en'

export const [selectedLocale] = Intl.DateTimeFormat.supportedLocalesOf([
    language,
    'en',
])

// not sure if there can be discrepancies between supported locales
// between DateTimeFormat and RelativeTimeFormat, but do this for safety
export const [relativeTimeLocale] = Intl.RelativeTimeFormat.supportedLocalesOf([
    language,
    'en',
])
