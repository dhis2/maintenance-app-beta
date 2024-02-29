import i18n from '@dhis2/d2-i18n'
import { TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { SchemaSection, useCheckMaxLengthFromSchema } from '../../lib'

export function DescriptionField({
    helpText,
    schemaSection,
}: {
    helpText?: string
    schemaSection: SchemaSection
}) {
    const validate = useCheckMaxLengthFromSchema(schemaSection.name, 'formName')

    const helpString =
        helpText || i18n.t("Explain the purpose of this and how it's measured.")

    return (
        <FieldRFF
            component={TextAreaFieldFF}
            dataTest="formfields-description"
            inputWidth="400px"
            name="description"
            label={i18n.t('Description')}
            helpText={helpString}
            validate={validate}
            validateFields={[]}
        />
    )
}
