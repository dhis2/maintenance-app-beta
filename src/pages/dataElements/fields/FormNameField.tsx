import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { useCheckMaxLengthFromSchema } from '../../../lib'
import { SchemaName } from '../../../types'

export function FormNameField() {
    const validate = useCheckMaxLengthFromSchema(
        SchemaName.dataElement,
        'formName'
    )

    return (
        <FieldRFF
            component={InputFieldFF}
            dataTest="formfields-formName"
            inputWidth="400px"
            name="formName"
            label={i18n.t('Form name')}
            helpText={i18n.t(
                'An alternative name used in section or automatic data entry forms.'
            )}
            validateFields={[]}
            validate={validate}
        />
    )
}
