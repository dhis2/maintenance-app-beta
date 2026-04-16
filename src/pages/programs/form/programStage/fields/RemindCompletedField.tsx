import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'

export function RemindCompletedField() {
    return (
        <FieldRFF
            name="remindCompleted"
            type="checkbox"
            component={CheckboxFieldFF}
            label={i18n.t('Ask user to complete enrollment after completion')}
            dataTest="formfields-remindCompleted"
            validateFields={[]}
        />
    )
}
