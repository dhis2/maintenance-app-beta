import i18n from '@dhis2/d2-i18n'
import { createMaxCharacterLength, TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { SchemaSection, useCheckMaxLengthFromSchema } from '../../../lib'

export function DescriptionField({
    helpText,
    schemaSection,
}: {
    helpText?: string
    schemaSection: SchemaSection
}) {
    const validate = createMaxCharacterLength(2000)

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
