import i18n from '@dhis2/d2-i18n'
import { TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'

export function SqlField() {
    return (
        <Field
            component={TextAreaFieldFF}
            name="sql"
            label={i18n.t('SQL')}
            required
            inputWidth="400px"
            dataTest="formfields-sql"
        />
    )
}
