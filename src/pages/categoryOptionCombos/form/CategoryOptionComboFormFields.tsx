import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    StandardFormField,
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    CodeField,
    CustomAttributesSection,
} from '../../../components'
import { SECTIONS_MAP } from '../../../lib'
import { Field } from 'react-final-form'
import { InputFieldFF } from '@dhis2/ui'

const section = SECTIONS_MAP.categoryCombo

export const CategoryOptionComboFormFields = () => {
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Set up the basic information for this category.')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <Field<string | undefined>
                        component={InputFieldFF}
                        dataTest="formfields-name"
                        disabled
                        inputWidth="400px"
                        label={i18n.t('Name')}
                        name="name"
                        validateFields={[]}
                    />
                </StandardFormField>

                <StandardFormField>
                    <CodeField schemaSection={section} />
                </StandardFormField>
            </StandardFormSection>
            <CustomAttributesSection />
        </>
    )
}
