import { Tooltip, TooltipProps } from '@dhis2/ui'
import React from 'react'

type TooltipWrapperProps = {
    condition: boolean
    children: React.ReactNode
} & TooltipProps

export const TooltipWrapper = ({
    children,
    condition,
    ...tooltipProps
}: TooltipWrapperProps) => {
    if (condition) {
        return <Tooltip {...tooltipProps}>{children}</Tooltip>
    }
    return <>{children}</>
}
