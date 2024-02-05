import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { useCheckMaxLengthFromSchema } from '../../../lib'
import type { SchemaName } from '../../../types'

export function CodeField() {
    const validate = useCheckMaxLengthFromSchema(
        'dataElement' as SchemaName,
        'code'
    )

    return (
        <FieldRFF
            component={InputFieldFF}
            dataTest="dataelementsformfields-code"
            inputWidth="150px"
            name="code"
            label={i18n.t('Code')}
            validateFields={[]}
            validate={validate}
        />
    )
}
