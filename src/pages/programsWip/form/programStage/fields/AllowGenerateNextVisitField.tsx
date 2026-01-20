import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'

export function AllowGenerateNextVisitField() {
    return (
        <FieldRFF
            name="allowGenerateNextVisit"
            type="checkbox"
            component={CheckboxFieldFF}
            label={i18n.t(
                'On event completion, show a prompt to create a new event'
            )}
            dataTest="formfields-allowGenerateNextVisit"
        />
    )
}
