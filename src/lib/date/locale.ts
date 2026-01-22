import i18n from '@dhis2/d2-i18n'

const toBCP47 = (locale) => {
  if (!locale) return locale;
  const parts = locale.split('_');
  if (parts.length === 3) {
    const [lang, region, script] = parts;
    return `${lang}-${script}-${region}`;
  }

  return locale.replace(/_/g, '-');
};

const language = toBCP47(i18n.language) || 'en';

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
