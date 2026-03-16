import '@testing-library/jest-dom'

const mockSupportedLocalesOf = (locales?: Intl.LocalesArgument) => {
    if (!locales) {
        return []
    }
    return Array.isArray(locales) ? locales : [locales]
}

describe('locale', () => {
    const dateTimeSupportedLocalesOf = jest.spyOn(
        Intl.DateTimeFormat,
        'supportedLocalesOf'
    )
    const relativeTimeSupportedLocalesOf = jest.spyOn(
        Intl.RelativeTimeFormat,
        'supportedLocalesOf'
    )

    beforeEach(() => {
        dateTimeSupportedLocalesOf.mockImplementation(mockSupportedLocalesOf)
        relativeTimeSupportedLocalesOf.mockImplementation(
            mockSupportedLocalesOf
        )
        jest.resetModules()
    })

    afterEach(() => {
        dateTimeSupportedLocalesOf.mockReset()
        relativeTimeSupportedLocalesOf.mockReset()
        jest.resetModules()
    })

    const loadLocaleWithLanguage = async (language?: string) => {
        jest.doMock('@dhis2/d2-i18n', () => ({
            __esModule: true,
            default: { language },
        }))

        return import('./locale')
    }

    it('uses the language only when no country or script is present', async () => {
        const locale = await loadLocaleWithLanguage('en')

        expect(locale.selectedLocale).toBe('en')
        expect(locale.relativeTimeLocale).toBe('en')
        expect(dateTimeSupportedLocalesOf).toHaveBeenCalledWith(['en', 'en'])
        expect(relativeTimeSupportedLocalesOf).toHaveBeenCalledWith([
            'en',
            'en',
        ])
    })

    it('converts language_country to language-country', async () => {
        const locale = await loadLocaleWithLanguage('en_US')

        expect(locale.selectedLocale).toBe('en-US')
        expect(locale.relativeTimeLocale).toBe('en-US')
        expect(dateTimeSupportedLocalesOf).toHaveBeenCalledWith(['en-US', 'en'])
        expect(relativeTimeSupportedLocalesOf).toHaveBeenCalledWith([
            'en-US',
            'en',
        ])
    })

    it('converts language_country_script to language-script-country', async () => {
        const locale = await loadLocaleWithLanguage('uz_UZ_Cyrl')

        expect(locale.selectedLocale).toBe('uz-Cyrl-UZ')
        expect(locale.relativeTimeLocale).toBe('uz-Cyrl-UZ')
        expect(dateTimeSupportedLocalesOf).toHaveBeenCalledWith([
            'uz-Cyrl-UZ',
            'en',
        ])
        expect(relativeTimeSupportedLocalesOf).toHaveBeenCalledWith([
            'uz-Cyrl-UZ',
            'en',
        ])
    })
})
