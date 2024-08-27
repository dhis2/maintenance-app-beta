import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, RadioFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'
import {
    CustomAttributesSection,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    HorizontalFieldGroup,
    ModelTransferField,
    NameField,
    CodeField,
} from '../../../components'
import { SECTIONS_MAP } from '../../../lib'

export const CategoryComboFormFields = () => {
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
                <StandardFormField>
                    <NameField schemaSection={section} />
                </StandardFormField>

                <StandardFormField>
                    <CodeField schemaSection={section} />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Data configuration')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose how this category combo will be used to capture and analyze data.'
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
                        name="skipTotal"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t('Skip category total in reports')}
                    />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Categories')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose the categories to include in this category combo.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <StandardFormField>
                        <ModelTransferField
                            name="categories"
                            query={{
                                resource: 'categories',
                                params: {
                                    filter: ['name:ne:default'],
                                },
                            }}
                            leftHeader={i18n.t('Available categories')}
                            rightHeader={i18n.t('Selected categories')}
                            filterPlaceholder={i18n.t(
                                'Filter available categories'
                            )}
                            filterPlaceholderPicked={i18n.t(
                                'Filter selected categories'
                            )}
                        />
                    </StandardFormField>
                </StandardFormField>
            </StandardFormSection>
        </>
    )
}
