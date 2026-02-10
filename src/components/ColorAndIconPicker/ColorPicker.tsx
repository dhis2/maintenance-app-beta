import i18n from '@dhis2/d2-i18n'
import {
    IconChevronDown16,
    IconChevronUp16,
    Layer,
    Popper,
    Button,
} from '@dhis2/ui'
import cx from 'classnames'
import React, { useRef, useState } from 'react'
import { CompactPicker } from 'react-color'
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
                type="button"
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
                <Layer onBackdropClick={() => setShowPicker(false)}>
                    <Popper placement="bottom-start" reference={ref}>
                        <div className={classes.colors} data-test="colors">
                            <CompactPicker
                                colors={AVAILABLE_COLORS}
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
                            {color && (
                                <Button
                                    type="button"
                                    onClick={() => {
                                        onColorPick({ color: '' })
                                        setShowPicker(false)
                                    }}
                                    secondary
                                    destructive
                                    small
                                    dataTest="color-clear-button"
                                >
                                    {i18n.t('Remove color')}
                                </Button>
                            )}
                        </div>
                    </Popper>
                </Layer>
            )}
        </>
    )
}
