import i18n from '@dhis2/d2-i18n'
import { Radio } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { HorizontalFieldGroup } from '../../../../../components'

const REPORT_DATE_OPTIONS = [
    {
        value: 'enrollmentDate',
        label: i18n.t('Enrollment date'),
    },
    {
        value: 'incidentDate',
        label: i18n.t('Incident date'),
    },
    {
        value: '',
        label: i18n.t('None (report date will be empty)'),
    },
] as const

export function ReportDateToUseField() {
    const { input } = useField<string | undefined>('reportDateToUse', {
        validateFields: [],
    })

    const handleChange = (value: string) => {
        input.onChange(value === '' ? undefined : value)
        input.onBlur()
    }

    const currentValue = input.value ?? ''

    return (
        <HorizontalFieldGroup
            label={i18n.t('Date to use for created event report date')}
            dataTest="formfields-reportDateToUse"
        >
            {REPORT_DATE_OPTIONS.map((option) => (
                <Radio
                    key={option.value}
                    name="reportDateToUse"
                    checked={currentValue === option.value}
                    value={option.value}
                    label={option.label}
                    onChange={() => handleChange(option.value)}
                    dataTest={`formfields-reportDateToUse-${
                        option.value || 'none'
                    }`}
                />
            ))}
        </HorizontalFieldGroup>
    )
}
