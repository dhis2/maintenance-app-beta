import React from 'react'
import classes from './ColorAndIconPicker.module.css'
import { ColorPicker } from './ColorPicker'
import { IconPicker } from './IconPicker'

export function ColorAndIconPicker({
    color = '',
    icon = '',
    onColorPick,
    onIconPick,
}: {
    onColorPick: ({ color }: { color: string }) => void
    onIconPick: ({ icon }: { icon: string }) => void
    color?: string
    icon?: string
}) {
    return (
        <div className={classes.container}>
            <ColorPicker color={color} onColorPick={onColorPick} />

            <IconPicker icon={icon} onIconPick={onIconPick} />
        </div>
    )
}
