import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { SchemaSection, useCheckMaxLengthFromSchema } from '../../lib'

export function CodeField({ schemaSection }: { schemaSection: SchemaSection }) {
    const validate = useCheckMaxLengthFromSchema(schemaSection.name, 'code')

    return (
        <FieldRFF
            component={InputFieldFF}
            dataTest="formfields-code"
            inputWidth="150px"
            name="code"
            label={i18n.t('Code')}
            validateFields={[]}
            validate={validate}
        />
    )
}
