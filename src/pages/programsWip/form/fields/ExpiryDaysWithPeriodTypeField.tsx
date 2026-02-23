import i18n from '@dhis2/d2-i18n'
import { Checkbox, InputFieldFF, SingleSelectFieldFF } from '@dhis2/ui'
import React, { useState } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
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
    const n = Number(value)
    return !Number.isNaN(n) && n !== 0
}

export function ExpiryDaysWithPeriodTypeField() {
    const { input } = useField('expiryDays', {
        parse: (v?: string) =>
            v === undefined || v === '' ? undefined : Number(v),
        format: (v: number | undefined) => v?.toString() ?? '',
    })
    const [checked, setChecked] = useState(() => isEnabled(input.value))
    const num = Number(input.value) || 0

    const onToggle = (next: boolean) => {
        setChecked(next)
        input.onChange(next ? num || 7 : 0)
        input.onBlur()
    }

    return (
        <div className={setupClasses.setupCheckboxBlock}>
            <Checkbox
                label={i18n.t(
                    'Close data entry a number of days after the end of a period'
                )}
                onChange={({ checked: c }) => onToggle(c)}
                checked={checked}
            />
            {checked && (
                <div className={setupClasses.expiryDaysRow}>
                    <FieldRFF
                        name="expiryDays"
                        type="number"
                        min="1"
                        parse={(v?: string) =>
                            v === undefined || v === '' ? undefined : Number(v)
                        }
                        format={(v: number | undefined) => v?.toString() ?? ''}
                        render={({ input: inp, meta: m }) => (
                            <InputFieldFF
                                input={inp}
                                meta={m as FieldMetaState<string | undefined>}
                                inputWidth="150px"
                                label={i18n.t('Number of days')}
                                dataTest="formfields-expiryDays"
                            />
                        )}
                    />
                    <FieldRFF
                        name="expiryPeriodType"
                        format={(value: string | undefined) => value ?? ''}
                        parse={(value: string) =>
                            value === '' ? undefined : value
                        }
                        render={({ input: inp, meta }) => (
                            <SingleSelectFieldFF
                                input={inp}
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
