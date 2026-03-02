import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'

export function OpenAfterEnrollmentField() {
    return (
        <FieldRFF
            name="openAfterEnrollment"
            type="checkbox"
            component={CheckboxFieldFF}
            label={i18n.t('Open data entry form after enrollment')}
            dataTest="formfields-openAfterEnrollment"
            validateFields={[]}
        />
    )
}
