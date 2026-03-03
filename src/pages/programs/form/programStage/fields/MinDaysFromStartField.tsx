import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'

export function MinDaysFromStartField() {
    return (
        <Field
            component={InputFieldFF}
            inputWidth="200px"
            name="minDaysFromStart"
            dataTest="formfields-minDaysFromStart"
            type="number"
            required
            label={i18n.t('Scheduled days from start (required)')}
            helpText={i18n.t(
                'Days to add to the enrollment or incident date. 0 means same day. '
            )}
            format={(value: unknown) => {
                if (value === null || value === undefined) {
                    return '0'
                }
                if (typeof value === 'number') {
                    return String(value)
                }
                const num = Number(value)
                return String(Number.isNaN(num) ? 0 : num)
            }}
            parse={(value: unknown) => {
                if (value === undefined || value === '') {
                    return 0
                }
                const parsed = Number.parseInt(value as string, 10)
                return Number.isNaN(parsed) ? 0 : parsed
            }}
        />
    )
}
