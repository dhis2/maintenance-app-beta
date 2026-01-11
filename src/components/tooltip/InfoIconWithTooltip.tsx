import { Tooltip, TooltipProps, IconInfo16, colors } from '@dhis2/ui'
import React from 'react'

type InfoIconWithTooltipProps = {
    content: TooltipProps['content']
    iconColor?: string
    text?: string
} & Omit<TooltipProps, 'content' | 'children'>

export const InfoIconWithTooltip = ({
    content,
    iconColor = colors.grey700,
    text,
    ...tooltipProps
}: InfoIconWithTooltipProps) => {
    return (
        <span
            style={{
                display: 'flex',
                gap: '2px',
                fontSize: '12px',
                color: colors.grey700,
            }}
        >
            <Tooltip content={content} {...tooltipProps}>
                <IconInfo16 color={iconColor} />
            </Tooltip>
            {text && <span>{text}</span>}
        </span>
    )
}
