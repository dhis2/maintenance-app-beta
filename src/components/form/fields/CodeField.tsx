import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { SchemaSection } from '../../../lib'
import { useValidator } from '../../../lib/models/useFieldValidators'

export function CodeField({
    schemaSection,
    modelId,
}: {
    schemaSection: SchemaSection
    modelId?: string
}) {
    const validator = useValidator({ schemaSection, property: 'code', modelId })

    return (
        <FieldRFF
            component={InputFieldFF}
            dataTest="formfields-code"
            inputWidth="150px"
            name="code"
            label={i18n.t('Code')}
            validateFields={[]}
            validate={(code?: string) => validator(code)}
        />
    )
}
