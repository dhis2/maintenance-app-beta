import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import {
    DefaultIdentifiableFields,
    DescriptionField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'

function ConstantFormFields() {
    return (
        <>
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
                        helpText={i18n.t(
                            'Explain the purpose of this constant.'
                        )}
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF
                        component={InputFieldFF}
                        dataTest="formfields-value"
                        inputWidth="400px"
                        name="value"
                        required
                        type="number"
                        label={i18n.t('Value')}
                    />
                </StandardFormField>
            </StandardFormSection>
        </>
    )
}

export default ConstantFormFields
