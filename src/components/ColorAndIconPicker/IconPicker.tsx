import i18n from '@dhis2/d2-i18n'
import { IconChevronDown16, IconChevronUp16 } from '@dhis2/ui'
import React, { useState } from 'react'
import { EmptySwatchIcon } from './EmptySwatchIcon'
import classes from './IconPicker.module.css'
import { IconPickerModal } from './IconPickerModal'
import { useIconQuery } from './useIconsQuery'

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
                className={classes.container}
                data-test="iconpicker-trigger"
                aria-expanded={showPicker}
                aria-haspopup="dialog"
                aria-label={
                    icon
                        ? `${i18n.t('Icon')}: ${icon}`
                        : i18n.t('Icon: none selected')
                }
            >
                <span className={classes.label}>{i18n.t('Icon')}</span>
                <span className={classes.iconSwatch}>
                    {icon && selectedIcon ? (
                        <img
                            className={classes.iconImage}
                            alt={selectedIcon.key}
                            src={selectedIcon.href}
                        />
                    ) : (
                        <EmptySwatchIcon className={classes.emptyIcon} />
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
