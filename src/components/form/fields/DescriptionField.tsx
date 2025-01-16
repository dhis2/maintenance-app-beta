import i18n from '@dhis2/d2-i18n'
import { TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { SchemaSection } from '../../../lib'
import { useValidator } from '../../../lib/models/useFieldValidators'

export function DescriptionField({
    helpText,
    schemaSection,
}: {
    helpText?: string
    schemaSection: SchemaSection
}) {
    const validate = useValidator({ schemaSection, property: 'description' })

    return (
        <FieldRFF
            component={TextAreaFieldFF}
            dataTest="formfields-description"
            inputWidth="400px"
            name="description"
            label={i18n.t('Description')}
            helpText={helpText}
            validate={validate}
            validateFields={[]}
        />
    )
}
