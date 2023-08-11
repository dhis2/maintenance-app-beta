import { relativeTimeLocale } from './locale'

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

const relativeTimeFormatter = new Intl.RelativeTimeFormat(relativeTimeLocale, {
    numeric: 'always',
})

/**
 * Get language-sensitive relative time message from Dates.
 * @param relative  - the relative dateTime
 * @param from     - the dateTime of reference
 */
export function getRelativeTime(
    relative: Date,
    from: Date = new Date()
): string {
    const delta = relative.getTime() - from.getTime()
    return getRelativeTimeFromDelta(delta)
}

/**
 * Get language-sensitive relative time message from elapsed time.
 * @param delta  - the elapsed time in milliseconds, negative if in the past
 */
export function getRelativeTimeFromDelta(delta: number): string {
    // get closest unit
    const absoluteDelta = Math.abs(delta)
    for (const { unit, ms } of units) {
        if (absoluteDelta >= ms || unit === 'second') {
            return relativeTimeFormatter.format(Math.round(delta / ms), unit)
        }
    }
    return ''
}
