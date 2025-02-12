import {
    convertFromIso8601,
    convertToIso8601,
} from '@dhis2/multi-calendar-dates'
import { SupportedDateFormat, SupportedCalendar } from './periodTypesMapping'

const GREGORY_CALENDARS = ['gregory', 'gregorian', 'iso8601'] // calendars that can be parsed by JS Date

const padWithZeros = (startValue: string, minLength: number) => {
    try {
        const startString = String(startValue)
        return startString.padStart(minLength, '0')
    } catch (e) {
        console.error(e)
        return startValue
    }
}

export const formatISODateTimeString = (
    dateString: string | undefined,
    dateFormat: SupportedDateFormat,
    calendar: SupportedCalendar
): string => {
    if (dateString === undefined) {
        return ''
    }
    const convertedDate = convertFromIso8601(dateString, calendar)
    const { year, month, day, eraYear } = convertedDate
    const ISOyear = ['ethiopian', 'ethiopic'].includes(calendar)
        ? eraYear
        : year
    if (dateFormat === 'DD-MM-YYYY') {
        return `${padWithZeros(String(day), 2)}-${padWithZeros(
            String(month),
            2
        )}-${padWithZeros(String(ISOyear), 4)}`
    }
    return `${padWithZeros(String(ISOyear), 4)}-${padWithZeros(
        String(month),
        2
    )}-${padWithZeros(String(day), 2)}`
}

const parseISODate = (dateString: string) => {
    const [year, month, day] = dateString.split('-')
    return { year, month, day, eraYear: year }
}

export const convertFromIso8601ToString = (
    date: string,
    calendar: SupportedCalendar,
    dateFormat: SupportedDateFormat
) => {
    // skip if there is no date
    if (!date) {
        return undefined
    }

    // separate the YYYY-MM-DD and time portions of the string
    const [inCalendarDateString, timeString] = date.split('T')

    const { year, eraYear, month, day } = GREGORY_CALENDARS.includes(calendar)
        ? parseISODate(inCalendarDateString)
        : convertFromIso8601(inCalendarDateString, calendar)
    const ISOyear = ['ethiopian', 'ethiopic'].includes(calendar)
        ? eraYear
        : year
    const dateStringPortion =
        dateFormat === 'DD-MM-YYYY'
            ? `${padWithZeros(String(day), 2)}-${padWithZeros(
                  String(month),
                  2
              )}-${padWithZeros(String(ISOyear), 4)}`
            : `${padWithZeros(String(ISOyear), 4)}-${padWithZeros(
                  String(month),
                  2
              )}-${padWithZeros(String(day), 2)}`
    return `${dateStringPortion}${timeString ? 'T' + timeString : ''}`
}

export const convertToIso8601ToString = (
    date: string,
    calendar: SupportedCalendar,
    dateFormat: SupportedDateFormat
) => {
    // skip if there is no date
    if (!date) {
        return undefined
    }

    // separate the YYYY-MM-DD and time portions of the string
    // and reverse if order is DD-MM-YYYY
    const inCalendarDateString =
        dateFormat === 'DD-MM-YYYY'
            ? date.substring(0, 10).split('-').reverse().join('-')
            : date.substring(0, 10)

    const timeString = date.substring(11)

    const { year, month, day } = GREGORY_CALENDARS.includes(calendar)
        ? parseISODate(inCalendarDateString)
        : convertToIso8601(inCalendarDateString, calendar)

    return `${padWithZeros(String(year), 4)}-${padWithZeros(
        String(month),
        2
    )}-${padWithZeros(String(day), 2)}${timeString ? 'T' + timeString : ''}`
}
