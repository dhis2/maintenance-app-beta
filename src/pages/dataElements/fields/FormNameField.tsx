import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { useCheckMaxLengthFromSchema } from '../../../lib'
import type { SchemaName } from '../../../types'

export function FormNameField() {
    const validate = useCheckMaxLengthFromSchema(
        'dataElement' as SchemaName,
        'formName'
    )

    return (
        <FieldRFF
            component={InputFieldFF}
            dataTest="dataelementsformfields-formname"
            inputWidth="400px"
            name="formName"
            label={i18n.t('StandardForm name')}
            helpText={i18n.t(
                'An alternative name used in section or automatic data entry forms.'
            )}
            validateFields={[]}
            validate={validate}
        />
    )
}
