import i18n from '@dhis2/d2-i18n'

type TimeUnit = {
    unit: Intl.RelativeTimeFormatUnit
    ms: number
}

const units: TimeUnit[] = [
    { unit: 'year', ms: 31536000000 },
    { unit: 'month', ms: 2628000000 },
    { unit: 'day', ms: 86400000 },
    { unit: 'hour', ms: 3600000 },
    { unit: 'minute', ms: 60000 },
    { unit: 'second', ms: 1000 },
]

const lang = i18n.language || 'en'
const relativeTimeFormatter = new Intl.RelativeTimeFormat(lang, {
    numeric: 'auto',
})

/**
 * Get language-sensitive relative time message from Dates.
 * @param relative  - the relative dateTime
 * @param from     - the dateTime of reference
 */
export function getRelativeTime(
    relative: Date | null,
    from: Date = new Date()
): string {
    if (!relative) {
        return ''
    }
    const delta = relative.getTime() - from.getTime()
    return getRelativeTimeFromDelta(delta)
}

/**
 * Get language-sensitive relative time message from elapsed time.
 * @param delta  - the elapsed time in milliseconds, negative if in the past
 */
export function getRelativeTimeFromDelta(delta: number): string {
    // get closest unit
    for (const { unit, ms } of units) {
        if (Math.abs(delta) >= ms || unit === 'second') {
            return relativeTimeFormatter.format(Math.round(delta / ms), unit)
        }
    }
    return ''
}
