import { useTimeZoneConversion } from '@dhis2/app-runtime'
import React from 'react'
import { getRelativeTime } from '../../../lib'

export const DateValue = ({ value }: { value?: string }) => {
    const { fromServerDate } = useTimeZoneConversion()

    const clientDate = fromServerDate(value)

    if (!value) {
        return null
    }

    return (
        <span title={clientDate.getClientZonedISOString()}>
            {getRelativeTime(clientDate)}
        </span>
    )
}
