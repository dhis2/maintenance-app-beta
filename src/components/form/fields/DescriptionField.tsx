import i18n from '@dhis2/d2-i18n'
import { createMaxCharacterLength, TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { SchemaSection } from '../../../lib'

const validateMaxLength = createMaxCharacterLength(2000)

export function DescriptionField({
    helpText,
    schemaSection,
}: {
    helpText?: string
    schemaSection: SchemaSection
}) {
    return (
        <FieldRFF
            component={TextAreaFieldFF}
            dataTest="formfields-description"
            inputWidth="400px"
            name="description"
            label={i18n.t('Description')}
            helpText={helpText}
            validate={validateMaxLength}
            validateFields={[]}
        />
    )
}
