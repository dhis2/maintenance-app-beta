import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'

export function InheritField() {
    return (
        <FieldRFF
            component={CheckboxFieldFF}
            dataTest="formfields-inherit"
            name="inherit"
            label={i18n.t('Inherit data values from other tracked entities')}
            type="checkbox"
            helpText={i18n.t(
                'Data values are inherited from tracked entities linked by a relationship.'
            )}
            validateFields={[]}
        />
    )
}
