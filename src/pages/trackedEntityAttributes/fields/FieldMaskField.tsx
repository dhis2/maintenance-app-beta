import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { useCheckMaxLengthFromSchema } from '../../../lib'
import { SchemaName } from '../../../types'

export function FieldMaskField() {
    const validate = useCheckMaxLengthFromSchema(
        SchemaName.trackedEntityAttribute,
        'fieldMask'
    )

    return (
        <FieldRFF
            component={InputFieldFF}
            inputWidth="400px"
            dataTest="formfields-fieldMask"
            name="fieldMask"
            label={i18n.t('Format for data entry')}
            helpText={i18n.t(
                'Provide a formatting hint or example. This will only be shown in Android Capture app.'
            )}
            validateFields={[]}
            validate={validate}
        />
    )
}
