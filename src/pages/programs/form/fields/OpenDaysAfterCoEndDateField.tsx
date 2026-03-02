import i18n from '@dhis2/d2-i18n'
import { Checkbox, InputFieldFF } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { useField } from 'react-final-form'
import type { FieldMetaState } from 'react-final-form'
import setupClasses from '../SetupFormContents.module.css'

function isEnabled(value: unknown): boolean {
    if (value == null || value === '') {
        return false
    }
    const numericValue = Number(value)
    return !Number.isNaN(numericValue) && numericValue !== 0
}

export function OpenDaysAfterCoEndDateField() {
    const { input, meta } = useField('openDaysAfterCoEndDate', {
        parse: (rawValue?: string) =>
            rawValue === undefined || rawValue === ''
                ? undefined
                : Number(rawValue),
        format: (numericValue: number | undefined) =>
            numericValue?.toString() ?? '',
    })
    const [checked, setChecked] = useState(() => isEnabled(input.value))

    useEffect(() => {
        if (isEnabled(input.value)) {
            setChecked(true)
        }
    }, [input.value])

    const num = Number(input.value)

    const onToggle = (next: boolean) => {
        setChecked(next)
        input.onChange(next ? num || 7 : 0)
        input.onBlur()
    }

    return (
        <div className={setupClasses.setupCheckboxBlock}>
            <Checkbox
                label={
                    <>
                        {i18n.t(
                            'Close data entry a number of days after "Implementing partner" end date'
                        )}
                        <span className={setupClasses.devNote}>
                            {i18n.t(
                                '(dev note: only shown if COC is selected and has end date)'
                            )}
                        </span>
                    </>
                }
                onChange={({ checked: isChecked }) => onToggle(isChecked)}
                checked={checked}
            />
            {checked && (
                <div className={setupClasses.expiryDaysRow}>
                    <InputFieldFF
                        input={input}
                        meta={meta as FieldMetaState<string | undefined>}
                        inputWidth="150px"
                        label={i18n.t('Number of days')}
                        dataTest="formfields-openDaysAfterCoEndDate"
                    />
                </div>
            )}
        </div>
    )
}
