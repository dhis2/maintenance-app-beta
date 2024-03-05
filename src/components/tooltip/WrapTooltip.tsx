import i18n from '@dhis2/d2-i18n'
import { Tooltip, TooltipProps } from '@dhis2/ui'
import React from 'react'

type WrapWithTooltipProps = {
    condition: boolean
    children: React.ReactNode
} & TooltipProps

const TOOLTIPS = {
    disabled: i18n.t('You do not have access to edit this item.'),
}

export const WrapWithTooltip = ({
    children,
    condition,
    ...tooltipProps
}: WrapWithTooltipProps) => {
    if (condition) {
        return <Tooltip {...tooltipProps}>{children}</Tooltip>
    }
    return <>{children}</>
}

WrapWithTooltip.TOOLTIPS = TOOLTIPS
