import { IconChevronDown16, IconChevronUp16, IconEmptyFrame24 } from '@dhis2/ui'
import cx from 'classnames'
import React, { useState } from 'react'
import classes from './IconPicker.module.css'
import { IconPickerModal } from './IconPickerModal'
import { useIconsQuery } from './useIconsQuery'

export function IconPicker({
    icon = '',
    onIconPick,
}: {
    onIconPick: ({ icon }: { icon: string }) => void
    icon?: string
}) {
    const [showPicker, setShowPicker] = useState(false)
    const icons = useIconsQuery()
    const selectedIcon = icons.data.all.find(({ key }) => key === icon)

    return (
        <>
            <div
                onClick={() => setShowPicker(true)}
                className={cx(classes.container, {
                    [classes.hasIcon]: !!icon,
                })}
            >
                <div className={classes.chosenIcon}>
                    {!icon && <IconEmptyFrame24 />}
                    {selectedIcon && (
                        <img
                            className={classes.iconImage}
                            alt={selectedIcon.description}
                            src={selectedIcon.href}
                        />
                    )}
                </div>

                <div className={classes.openCloseIconContainer}>
                    {showPicker ? <IconChevronUp16 /> : <IconChevronDown16 />}
                </div>
            </div>

            {showPicker && (
                <IconPickerModal
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
