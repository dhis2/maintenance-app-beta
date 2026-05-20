import i18n from '@dhis2/d2-i18n'
import { Checkbox, InputFieldFF } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import setupClasses from '../common/SetupFormContents.module.css'

function isEnabled(value: unknown): boolean {
    if (value == null || value === '') {
        return false
    }
    const numericValue = Number(value)
    return !Number.isNaN(numericValue) && numericValue !== 0
}

export function CompleteEventsExpiryDaysField() {
    const { input } = useField('completeEventsExpiryDays')
    const [checked, setChecked] = useState(() => isEnabled(input.value))

    useEffect(() => {
        if (isEnabled(input.value)) {
            setChecked(true)
        }
    }, [input.value])

    const onToggle = (isChecked: boolean) => {
        setChecked(isChecked)
        if (!isChecked) {
            input.onChange(0)
        }
        input.onBlur()
    }

    return (
        <div className={setupClasses.setupCheckboxBlock}>
            <Checkbox
                label={i18n.t('Lock events a number of days after completion')}
                onChange={({ checked: isChecked }) => onToggle(isChecked)}
                checked={checked}
            />
            {checked && (
                <div className={setupClasses.expiryDaysRow}>
                    <FieldRFF
                        name="completeEventsExpiryDays"
                        component={InputFieldFF}
                        type="number"
                        min="0"
                        inputWidth="150px"
                        label={i18n.t('Number of days')}
                        dataTest="formfields-completeEventsExpiryDays"
                        format={(value: unknown) => value?.toString()}
                        parse={(value: unknown) => {
                            if (value === undefined || value === null) {
                                return null
                            }
                            if (value === '') {
                                return 0
                            }
                            return Number.parseInt(value as string, 10)
                        }}
                    />
                </div>
            )}
        </div>
    )
}
