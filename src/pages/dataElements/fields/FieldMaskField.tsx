import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { useCheckMaxLengthFromSchema } from '../../../lib'
import type { SchemaName } from '../../../types'

export function FieldMaskField() {
    const validate = useCheckMaxLengthFromSchema(
        'dataElement' as SchemaName,
        'fieldMask'
    )

    return (
        <FieldRFF
            component={InputFieldFF}
            inputWidth="400px"
            dataTest="formfields-fieldmask"
            name="fieldMask"
            label={i18n.t('Field mask')}
            helpText={i18n.t(
                'Use a pattern to limit what information can be entered.'
            )}
            placeholder={i18n.t('e.g. 999-000-0000')}
            validateFields={[]}
            validate={validate}
        />
    )
}
