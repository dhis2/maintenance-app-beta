import { useTimeZoneConversion } from '@dhis2/app-runtime'
import React, { useMemo, useState } from 'react'
import { selectedLocale } from '../../lib'

type DateTimeFormatOptions = Intl.DateTimeFormatOptions

const defaultDateTimeFormatter = new Intl.DateTimeFormat(selectedLocale, {
    dateStyle: 'medium',
    timeStyle: 'medium',
})

type ClientDateTimeProps = {
    value?: string
    options?: DateTimeFormatOptions
}

export const ClientDateTime = ({ value, options }: ClientDateTimeProps) => {
    // note options cannot change after initial render
    const [dateTimeFormatter] = useState<Intl.DateTimeFormat>(() =>
        options
            ? new Intl.DateTimeFormat(selectedLocale, options)
            : defaultDateTimeFormatter
    )
    const { fromServerDate } = useTimeZoneConversion()

    if (!value) {
        return null
    }

    const clientDate = fromServerDate(value)

    return (
        <span title={clientDate.getClientZonedISOString()}>
            {dateTimeFormatter.format(clientDate)}
        </span>
    )
}
