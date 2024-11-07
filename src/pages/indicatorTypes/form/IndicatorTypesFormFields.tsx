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
} from '../../../components'

export const IndicatorTypesFormFields = () => {
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
                    <Field
                        name="name"
                        component={InputFieldFF}
                        label={i18n.t('Name')}
                        required
                    />
                </StandardFormField>

                <StandardFormField>
                    <Field
                        name="factor"
                        type="number"
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
