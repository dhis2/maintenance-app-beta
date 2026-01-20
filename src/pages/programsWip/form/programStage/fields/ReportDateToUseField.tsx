import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useFormState } from 'react-final-form'

export function ReportDateToUseField() {
    const { values } = useFormState({ subscription: { values: true } })
    const openAfterEnrollment = values?.openAfterEnrollment ?? false

    return (
        <FieldRFF
            name="reportDateToUse"
            component={SingleSelectFieldFF}
            inputWidth="400px"
            label={i18n.t('Report date to use')}
            dataTest="formfields-reportDateToUse"
            disabled={!openAfterEnrollment}
            validateFields={[]}
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
    )
}
