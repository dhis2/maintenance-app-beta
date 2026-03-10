import i18n from '@dhis2/d2-i18n'
import {
    IconChevronDown16,
    IconChevronUp16,
    Layer,
    Popper,
    Button,
} from '@dhis2/ui'
import React, { useRef, useState } from 'react'
import { CompactPicker } from 'react-color'
import { AVAILABLE_COLORS } from './availableColors'
import classes from './ColorPicker.module.css'
import { EmptySwatchIcon } from './EmptySwatchIcon'

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
                className={classes.container}
                data-test="colorpicker-trigger"
                aria-expanded={showPicker}
                aria-haspopup="true"
                aria-label={
                    color
                        ? `${i18n.t('Color')}: ${color}`
                        : i18n.t('Color: none selected')
                }
            >
                <span className={classes.label}>{i18n.t('Color')}</span>
                <span className={classes.colorSwatch}>
                    {color ? (
                        <span
                            className={classes.chosenColor}
                            style={{ background: color }}
                        />
                    ) : (
                        <EmptySwatchIcon className={classes.emptyColor} />
                    )}
                </span>
                <span
                    className={classes.openCloseIconContainer}
                    aria-hidden="true"
                >
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
