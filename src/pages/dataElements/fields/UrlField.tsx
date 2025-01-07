import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { useCheckMaxLengthFromSchema } from '../../../lib'
import type { SchemaName } from '../../../types'

export function UrlField() {
    const validate = useCheckMaxLengthFromSchema(
        'dataElement' as SchemaName,
        'url'
    )

    return (
        <FieldRFF
            component={InputFieldFF}
            dataTest="formfields-url"
            inputWidth="400px"
            name="url"
            label={i18n.t('Url')}
            helpText={i18n.t('A web link that provides extra information.')}
            validateFields={[]}
            validate={validate}
        />
    )
}
