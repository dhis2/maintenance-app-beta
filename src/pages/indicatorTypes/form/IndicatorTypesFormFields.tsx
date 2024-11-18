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
import { useSchemaSectionHandleOrThrow } from '../../../lib'

export const IndicatorTypesFormFields = () => {
    const schemaSection = useSchemaSectionHandleOrThrow()
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
                        required
                    />
                </StandardFormField>
            </StandardFormSection>
            <CustomAttributesSection />
        </>
    )
}
