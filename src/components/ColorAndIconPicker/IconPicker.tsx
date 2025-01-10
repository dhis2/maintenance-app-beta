import { IconChevronDown16, IconChevronUp16 } from '@dhis2/ui'
import cx from 'classnames'
import React, { useState } from 'react'
import classes from './IconPicker.module.css'
import { IconPickerModal } from './IconPickerModal'
import { useIconQuery, useIconsQuery } from './useIconsQuery'

export function IconPicker({
    icon = '',
    onIconPick,
}: {
    onIconPick: ({ icon }: { icon: string }) => void
    icon?: string
}) {
    const [showPicker, setShowPicker] = useState(false)
    const selectedIcon = useIconQuery({ key: icon }).data

    return (
        <>
            <button
                type="button"
                onClick={() => setShowPicker(true)}
                className={cx(classes.container, {
                    [classes.hasIcon]: !!icon,
                })}
                data-test="iconpicker-trigger"
            >
                <span className={classes.chosenIcon}>
                    {selectedIcon && (
                        <img
                            className={classes.iconImage}
                            alt={selectedIcon.description}
                            src={selectedIcon.href}
                        />
                    )}
                </span>

                <span className={classes.openCloseIconContainer}>
                    {showPicker ? <IconChevronUp16 /> : <IconChevronDown16 />}
                </span>
            </button>

            {showPicker && (
                <IconPickerModal
                    selected={icon}
                    onCancel={() => setShowPicker(false)}
                    onChange={({ icon }) => {
                        onIconPick({ icon })
                        setShowPicker(false)
                    }}
                />
            )}
        </>
    )
}
