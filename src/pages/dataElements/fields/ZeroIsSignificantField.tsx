import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'

export function ZeroIsSignificantField() {
    return (
        <FieldRFF
            component={CheckboxFieldFF}
            dataTest="formfields-zeroIsSignificant"
            name="zeroIsSignificant"
            label={i18n.t('Store zero data values')}
            type="checkbox"
            validateFields={[]}
        />
    )
}
