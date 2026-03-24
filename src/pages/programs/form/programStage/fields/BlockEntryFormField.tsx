import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'

export function BlockEntryFormField() {
    return (
        <FieldRFF
            name="blockEntryForm"
            type="checkbox"
            component={CheckboxFieldFF}
            label={i18n.t('Block data entry after completion')}
            dataTest="formfields-blockEntryForm"
            validateFields={[]}
        />
    )
}
