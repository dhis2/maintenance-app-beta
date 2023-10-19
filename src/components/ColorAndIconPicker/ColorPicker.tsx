import {
    IconChevronDown16,
    IconChevronUp16,
    IconEmptyFrame24,
    Layer,
    Popper,
} from '@dhis2/ui'
import cx from 'classnames'
import React, { useRef, useState } from 'react'
import { SwatchesPicker } from 'react-color'
import classes from './ColorPicker.module.css'

const COLORS = [
    [
        '#ffcdd2',
        '#e57373',
        '#d32f2f',
        '#f06292',
        '#c2185b',
        '#880e4f',
        '#f50057',
    ],
    [
        '#e1bee7',
        '#ba68c8',
        '#8e24aa',
        '#aa00ff',
        '#7e57c2',
        '#4527a0',
        '#7c4dff',
        '#6200ea',
    ],
    ['#c5cae9', '#7986cb', '#3949ab', '#304ffe'],
    ['#e3f2fd', '#64b5f6', '#1976d2', '#0288d1'],
    ['#40c4ff', '#00b0ff', '#80deea'],
    ['#00acc1', '#00838f', '#006064'],
    ['#e0f2f1', '#80cbc4', '#00695c', '#64ffda'],
    ['#c8e6c9', '#66bb6a', '#2e7d32', '#1b5e20'],
    ['#00e676', '#aed581', '#689f38', '#33691e'],
    ['#76ff03', '#64dd17', '#cddc39', '#9e9d24', '#827717'],
    [
        '#fff9c4',
        '#fbc02d',
        '#f57f17',
        '#ffff00',
        '#ffcc80',
        '#ffccbc',
        '#ffab91',
    ],
    ['#bcaaa4', '#8d6e63', '#4e342e'],
    ['#fafafa', '#bdbdbd', '#757575', '#424242'],
    ['#cfd8dc', '#b0bec5', '#607d8b', '#37474f'],
]

export function ColorPicker({
    onColorPick,
    color = '',
}: {
    onColorPick: ({ color }: { color: string }) => void
    color?: string
}) {
    const [showPicker, setShowPicker] = useState(false)
    const ref = useRef(null)

    return (
        <>
            <div
                ref={ref}
                onClick={() => setShowPicker(true)}
                className={cx(classes.container, {
                    [classes.hasColor]: !!color,
                })}
            >
                <div
                    className={classes.chosenColor}
                    style={{ background: color }}
                >
                    {!color && <IconEmptyFrame24 />}
                </div>

                <div className={classes.openCloseIconContainer}>
                    {showPicker ? <IconChevronUp16 /> : <IconChevronDown16 />}
                </div>
            </div>

            {showPicker && (
                <Layer onBackdropClick={() => setShowPicker(false)} translucent>
                    <Popper placement="bottom-start" reference={ref}>
                        <div className={classes.colors}>
                            <SwatchesPicker
                                presetColors={COLORS}
                                color={color}
                                onChangeComplete={({
                                    hex,
                                }: {
                                    hex: string
                                }) => {
                                    const nextColor = hex === color ? '' : hex
                                    onColorPick({ color: nextColor })
                                    setShowPicker(false)
                                }}
                            />
                        </div>
                    </Popper>
                </Layer>
            )}
        </>
    )
}
