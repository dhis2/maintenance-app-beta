import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, RadioFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field, useForm, useFormState } from 'react-final-form'
import {
    CustomAttributesSection,
    DefaultIdentifiableFields,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    DescriptionField,
    HorizontalFieldGroup,
    ModelTransferField,
    ModelTransfer,
} from '../../../components'
import { SECTIONS_MAP } from '../../../lib'

export const CategoryFormFields = () => {
    const section = SECTIONS_MAP.category

    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Set up the basic information for this category.')}
                </StandardFormSectionDescription>
                <DefaultIdentifiableFields />
                <DescriptionField
                    schemaSection={section}
                    helpText={i18n.t('Explain the purpose of this category.')}
                />
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Data configuration')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose how this category will be used to capture and analyze'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <HorizontalFieldGroup
                        label={'Data dimension type (required)'}
                    >
                        <Field<string | undefined>
                            name="dataDimensionType"
                            component={RadioFieldFF}
                            label={i18n.t('Disaggregation')}
                            type="radio"
                            value={'DISAGGREGATION'}
                        />
                        <Field<string | undefined>
                            name="dataDimensionType"
                            component={RadioFieldFF}
                            label={i18n.t('Attribute')}
                            type="radio"
                            value={'ATTRIBUTE'}
                        />
                    </HorizontalFieldGroup>
                </StandardFormField>
                <StandardFormField>
                    <Field
                        name="dataDimension"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t('Use as data dimension')}
                        helpText={i18n.t(
                            'Category will be available to the analytics as another dimension'
                        )}
                    />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Category options')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose the category options to include in this category.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <StandardFormField>
                        <ModelTransferField
                            label={i18n.t('Category options')}
                            name="categoryOptions"
                            query={{
                                resource: 'categoryOptions',
                                params: {
                                    filter: ['isDefault:eq:false'],
                                },
                            }}
                        />
                    </StandardFormField>
                </StandardFormField>
            </StandardFormSection>
            <CustomAttributesSection />
        </>
    )
}
