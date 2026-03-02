import i18n from '@dhis2/d2-i18n'
import { Checkbox, InputFieldFF, SingleSelectFieldFF } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { Field as FieldRFF, useField, useForm } from 'react-final-form'
import type { FieldMetaState } from 'react-final-form'
import { Program } from '../../../../types/generated'
import setupClasses from '../SetupFormContents.module.css'

const EXPIRY_PERIOD_TYPE_OPTIONS = Object.entries(Program.expiryPeriodType).map(
    ([, value]) => ({ label: value, value })
)

function isEnabled(value: unknown): boolean {
    if (value == null || value === '') {
        return false
    }
    const numericValue = Number(value)
    return !Number.isNaN(numericValue) && numericValue !== 0
}

export function ExpiryDaysWithPeriodTypeField() {
    const form = useForm()
    const { input, meta } = useField('expiryDays', {
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
        if (!next) {
            form.change('expiryPeriodType', undefined)
        }
    }

    return (
        <div className={setupClasses.setupCheckboxBlock}>
            <Checkbox
                label={i18n.t(
                    'Close data entry a number of days after the end of a period'
                )}
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
                        dataTest="formfields-expiryDays"
                    />
                    <FieldRFF
                        name="expiryPeriodType"
                        format={(value: string | undefined) => value ?? ''}
                        parse={(value: string) =>
                            value === '' ? undefined : value
                        }
                        render={({ input, meta }) => (
                            <SingleSelectFieldFF
                                input={input}
                                meta={meta}
                                inputWidth="200px"
                                label={i18n.t('Expiry period type')}
                                dataTest="formfields-expiryPeriodType"
                                options={EXPIRY_PERIOD_TYPE_OPTIONS}
                            />
                        )}
                    />
                </div>
            )}
        </div>
    )
}
