import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'

export function CompulsoryField() {
    return (
        <FieldRFF
            component={CheckboxFieldFF}
            dataTest="formfields-compulsory"
            name="compulsory"
            label={i18n.t('Compulsory')}
            type="checkbox"
            validateFields={[]}
        />
    )
}
