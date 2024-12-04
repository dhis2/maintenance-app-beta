import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'
import {
    CustomAttributesSection,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    NameField,
} from '../../../components'
import { SECTIONS_MAP, useSchemaSectionHandleOrThrow } from '../../../lib'
import { useValidator } from '../../../lib/models/useFieldValidators'

export const IndicatorTypesFormFields = () => {
    const section = SECTIONS_MAP.indicatorType
    const schemaSection = useSchemaSectionHandleOrThrow()

    const validateFactor = useValidator({ schemaSection, property: 'factor' })

    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this Indicator Type.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <NameField schemaSection={schemaSection} />
                </StandardFormField>

                <StandardFormField>
                    <Field
                        name="factor"
                        type="number"
                        inputWidth="400px"
                        component={InputFieldFF}
                        label={i18n.t('Factor')}
                        validate={validateFactor}
                        required
                    />
                </StandardFormField>
            </StandardFormSection>

            <CustomAttributesSection schemaSection={section} />
        </>
    )
}
