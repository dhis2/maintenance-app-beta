import i18n from '@dhis2/d2-i18n'
import { Radio } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { HorizontalFieldGroup } from '../../../../../components'

const REFERENCE_DATE_OPTIONS = [
    {
        value: 'true',
        label: i18n.t('Enrollment date'),
    },
    {
        value: 'false',
        label: i18n.t('Incident date'),
    },
] as const

export function GeneratedByEnrollmentDateField() {
    const { input } = useField<boolean | undefined>(
        'generatedByEnrollmentDate',
        { validateFields: [] }
    )

    const currentValue = String(input.value ?? true)

    const handleChange = (value: string) => {
        input.onChange(value === 'true')
        input.onBlur()
    }

    return (
        <HorizontalFieldGroup
            label={i18n.t('Reference date for scheduling')}
            dataTest="formfields-generatedByEnrollmentDate"
        >
            {REFERENCE_DATE_OPTIONS.map((option) => (
                <Radio
                    key={option.value}
                    name="generatedByEnrollmentDate"
                    checked={currentValue === option.value}
                    value={option.value}
                    label={option.label}
                    onChange={() => handleChange(option.value)}
                    dataTest={`formfields-generatedByEnrollmentDate-${option.value}`}
                />
            ))}
        </HorizontalFieldGroup>
    )
}
