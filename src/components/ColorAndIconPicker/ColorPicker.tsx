import { IconChevronDown16, IconChevronUp16, Layer, Popper } from '@dhis2/ui'
import cx from 'classnames'
import React, { useRef, useState } from 'react'
import { SwatchesPicker } from 'react-color'
import { AVAILABLE_COLORS } from './availableColors'
import classes from './ColorPicker.module.css'

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
            <button
                ref={ref}
                onClick={() => setShowPicker(true)}
                className={cx(classes.container, {
                    [classes.hasColor]: !!color,
                })}
                data-test="colorpicker-trigger"
            >
                <span
                    className={classes.chosenColor}
                    style={{ background: color }}
                />

                <span className={classes.openCloseIconContainer}>
                    {showPicker ? <IconChevronUp16 /> : <IconChevronDown16 />}
                </span>
            </button>

            {showPicker && (
                <Layer onBackdropClick={() => setShowPicker(false)} translucent>
                    <Popper placement="bottom-start" reference={ref}>
                        <div className={classes.colors}>
                            <SwatchesPicker
                                presetColors={AVAILABLE_COLORS}
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
