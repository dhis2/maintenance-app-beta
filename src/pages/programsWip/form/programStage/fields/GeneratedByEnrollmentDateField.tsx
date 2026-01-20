import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'

export function GeneratedByEnrollmentDateField() {
    return (
        <FieldRFF
            name="generatedByEnrollmentDate"
            type="checkbox"
            component={CheckboxFieldFF}
            label={i18n.t('Generate events based on enrollment date')}
            dataTest="formfields-generatedByEnrollmentDate"
            validateFields={[]}
        />
    )
}
