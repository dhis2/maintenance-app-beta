import i18n from '@dhis2/d2-i18n'
import { InputEventPayload, InputEventHandler } from '@dhis2/ui'
import React, { useState } from 'react'
import { ClearableInput } from '../../../components'
import styles from './Sidenav.module.css'

interface SidenavParentProps {
    onChange?: InputEventHandler<React.SyntheticEvent>
}

export const SidenavFilter = ({ onChange }: SidenavParentProps) => {
    const [value, setValue] = useState('')

    const handleChange = (
        input: InputEventPayload,
        e: React.SyntheticEvent
    ) => {
        setValue(input.value ?? '')
        if (onChange) {
            onChange(input, e)
        }
    }

    return (
        <div>
            <ClearableInput
                className={styles['sidenav-filter']}
                dense
                name="sidenav-filter"
                type="text"
                value={value}
                placeholder={i18n.t('Search for menu items')}
                onChange={handleChange}
                showClearButton={value.length > 0}
                onClear={(e) =>
                    handleChange({ value: '', name: 'sidenav-filter' }, e)
                }
            />
        </div>
    )
}
