import i18n from '@dhis2/d2-i18n'
import { Checkbox, InputFieldFF } from '@dhis2/ui'
import React, { useState } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import type { FieldMetaState } from 'react-final-form'
import setupClasses from '../SetupFormContents.module.css'

function isEnabled(value: unknown): boolean {
    if (value == null || value === '') {
        return false
    }
    const n = Number(value)
    return !Number.isNaN(n) && n !== 0
}

export function OpenDaysAfterCoEndDateField() {
    const { input } = useField('openDaysAfterCoEndDate', {
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
                onChange={({ checked: c }) => onToggle(c)}
                checked={checked}
            />
            {checked && (
                <div className={setupClasses.expiryDaysRow}>
                    <FieldRFF
                        name="openDaysAfterCoEndDate"
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
                                dataTest="formfields-openDaysAfterCoEndDate"
                            />
                        )}
                    />
                </div>
            )}
        </div>
    )
}
