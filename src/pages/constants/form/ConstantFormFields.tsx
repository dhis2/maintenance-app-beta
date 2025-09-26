import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import {
    CustomAttributesSection,
    DefaultIdentifiableFields,
    DescriptionField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SECTIONS_MAP, useSchemaSectionHandleOrThrow } from '../../../lib'
import { useValidator } from '../../../lib/models/useFieldValidators'

function ConstantFormFields() {
    const section = SECTIONS_MAP.constant
    const schemaSection = useSchemaSectionHandleOrThrow()
    const validate = useValidator({ schemaSection, property: 'value' })

    const { input, meta } = useField('value', {
        validate,
        type: 'number',
        format: (value) => (value != null ? String(value) : ''),
    })

    return (
        <StandardFormSection>
            <StandardFormSectionTitle>
                {i18n.t('Basic information')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t('Set up the basic information for this constant.')}
            </StandardFormSectionDescription>

            <DefaultIdentifiableFields />

            <StandardFormField>
                <DescriptionField
                    helpText={i18n.t('Explain the purpose of this constant.')}
                />
            </StandardFormField>

            <StandardFormField>
                <InputFieldFF
                    input={input}
                    meta={meta}
                    inputWidth="400px"
                    dataTest="formfields-value"
                    type="number"
                    label={i18n.t('Value (required)')}
                    required
                    helpText={i18n.t(
                        'Enter the numeric value to be used as the constant.'
                    )}
                />
            </StandardFormField>

            <CustomAttributesSection schemaSection={section} />
        </StandardFormSection>
    )
}

export default ConstantFormFields
