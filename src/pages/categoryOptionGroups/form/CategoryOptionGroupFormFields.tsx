import i18n from '@dhis2/d2-i18n'
import { RadioFieldFF, CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'
import {
    CustomAttributesSection,
    DefaultIdentifiableFields,
    DescriptionField,
    HorizontalFieldGroup,
    ModelTransferField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SECTIONS_MAP } from '../../../lib'

function CategoryOptionGroupFormFields() {
    const section = SECTIONS_MAP.categoryOptionGroup
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this category option group.'
                    )}
                </StandardFormSectionDescription>
                <DefaultIdentifiableFields />
                <DescriptionField
                    schemaSection={section}
                    helpText={i18n.t(
                        'Explain the purpose of this category option group.'
                    )}
                />
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Data configuration')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose how this category option  will be used to capture and analyze data.'
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
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    <label htmlFor={'categoryOptions'}>
                        {i18n.t('Category options')}
                    </label>
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose the options to include in this category option group.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <StandardFormField>
                        <ModelTransferField
                            name="categoryOptions"
                            query={{
                                resource: 'categoryOptions',
                                params: {
                                    filter: ['isDefault:eq:false'],
                                },
                            }}
                            leftHeader={i18n.t('Available category options')}
                            rightHeader={i18n.t('Selected category options')}
                            filterPlaceholder={i18n.t(
                                'Filter available category options'
                            )}
                            filterPlaceholderPicked={i18n.t(
                                'Filter selected category options'
                            )}
                        />
                    </StandardFormField>
                </StandardFormField>
                <CustomAttributesSection schemaSection={section} />
            </StandardFormSection>
        </>
    )
}

export default CategoryOptionGroupFormFields
