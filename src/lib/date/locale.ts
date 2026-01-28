import i18n from '@dhis2/d2-i18n'

const toBcp47 = (locale?: string) => {
    if (!locale) {
        return locale
    }

    const parts = String(locale).split('_')
    if (parts.length === 3) {
        const [lang, country, script] = parts
        return `${lang}-${script}-${country}`
    }

    return String(locale).replaceAll('_', '-')
}

// our locales use _ instead of - for locales
const language = toBcp47(i18n.language) || 'en'

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
