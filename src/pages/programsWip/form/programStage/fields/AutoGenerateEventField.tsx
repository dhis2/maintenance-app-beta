import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'

export function AutoGenerateEventField() {
    return (
        <FieldRFF
            name="autoGenerateEvent"
            type="checkbox"
            component={CheckboxFieldFF}
            label={i18n.t('Auto-generate an event in this stage')}
            dataTest="formfields-autoGenerateEvent"
            validateFields={[]}
        />
    )
}
