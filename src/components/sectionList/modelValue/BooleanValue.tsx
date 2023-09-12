import { IconCross24, IconCheckmark24 } from '@dhis2/ui-icons'
import React from 'react'

export const BooleanValue = ({ value }: { value?: boolean }) => {
    return <span>{value ? <IconCheckmark24 /> : <IconCross24 />}</span>
}
