import React from 'react'
import { getRelativeTime } from '../../../lib'

export const DateValue = ({ value }: { value?: string }) => {
    if (!value) {
        return null
    }
    return <div>{getRelativeTime(new Date(value))}</div>
}
