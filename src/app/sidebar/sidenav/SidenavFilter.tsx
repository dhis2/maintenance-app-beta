import i18n from '@dhis2/d2-i18n'
import { Input, InputEventPayload, InputChangeHandler } from '@dhis2/ui'
import React, { useState } from 'react'
import styles from './Sidenav.module.css'

interface SidenavParentProps {
    onChange?: InputChangeHandler
}

export const SidenavFilter = ({ onChange }: SidenavParentProps) => {
    const [value, setValue] = useState('')

    const handleChange = (
        input: InputEventPayload,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setValue(input.value ?? '')
        if (onChange) {
            onChange(input, e)
        }
    }

    return (
        <Input
            className={styles['sidenav-filter']}
            dense
            type="text"
            value={value}
            placeholder={i18n.t('Search menu items')}
            onChange={handleChange}
        />
    )
}
