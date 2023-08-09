import { useTimeZoneConversion } from '@dhis2/app-runtime'
import React from 'react'
import { getRelativeTime } from '../../../lib'

export const DateValue = ({ value }: { value?: string }) => {
    const { fromServerDate } = useTimeZoneConversion()

    if (!value) {
        return null
    }

    const clientDate = fromServerDate(value)

    return (
        <span title={clientDate.toLocaleString()}>
            {getRelativeTime(clientDate)}
        </span>
    )
}
