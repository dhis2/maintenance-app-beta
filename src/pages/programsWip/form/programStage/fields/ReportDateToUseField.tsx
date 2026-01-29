import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useFormState } from 'react-final-form'

export function ReportDateToUseField() {
    const { values } = useFormState({ subscription: { values: true } })
    const openAfterEnrollment = values?.openAfterEnrollment ?? false
// temp
    return (
        <FieldRFF
            name="reportDateToUse"
            format={(value: string | undefined) => value ?? ''}
            parse={(value: string) => (value === '' ? undefined : value)}
            render={({ input, meta }) => (
                <SingleSelectFieldFF
                    input={input}
                    meta={meta}
                    inputWidth="400px"
                    label={i18n.t('Report date to use')}
                    dataTest="formfields-reportDateToUse"
                    disabled={!openAfterEnrollment}
                    options={[
                        { label: i18n.t('<No value>'), value: '' },
                        {
                            label: i18n.t('Incident date'),
                            value: 'incidentDate',
                        },
                        {
                            label: i18n.t('Enrollment date'),
                            value: 'enrollmentDate',
                        },
                    ]}
                />
            )}
        />
    )
}
