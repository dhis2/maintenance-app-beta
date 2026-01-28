import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'

export function RepeatableField() {
    return (
        <FieldRFF
            name="repeatable"
            type="checkbox"
            component={CheckboxFieldFF}
            label={i18n.t(
                'Allow multiple events in this stage (repeatable stage)'
            )}
            dataTest="formfields-repeatable"
        />
    )
}
