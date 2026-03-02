import i18n from '@dhis2/d2-i18n'
import { InputFieldFF, number } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { Field as FieldRFF } from 'react-final-form'

export function StandardIntervalField() {
    const validator = useMemo(() => number, [])

    return (
        <FieldRFF
            name="standardInterval"
            component={InputFieldFF}
            type="number"
            inputWidth="200px"
            label={i18n.t('Standard interval days')}
            dataTest="formfields-standardInterval"
            validate={validator}
            validateFields={[]}
            format={(value: unknown) => value?.toString() ?? ''}
            parse={(value: unknown) => {
                if (value === undefined || value === '') {
                    return undefined
                }
                const num = Number(value)
                return Number.isNaN(num) ? undefined : num
            }}
            helpText={i18n.t(
                'Enter the number of days between repeated events.'
            )}
        />
    )
}
