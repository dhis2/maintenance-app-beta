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

function CategoryOptionGroupSetFormFields() {
    const section = SECTIONS_MAP.categoryOptionGroupSet
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this category option group set.'
                    )}
                </StandardFormSectionDescription>
                <DefaultIdentifiableFields />
                <DescriptionField
                    helpText={i18n.t(
                        'Explain the purpose of this category option group set.'
                    )}
                />
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Data configuration')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose how this category option group set will be used to capture and analyze data.'
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
                            'Make available to analytics apps as a selectable dimension.'
                        )}
                    />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    <label htmlFor={'categoryOptionGroups'}>
                        {i18n.t('Category option groups')}
                    </label>
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose the category option groups to include in this category option group set.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <StandardFormField>
                        <ModelTransferField
                            name="categoryOptionGroups"
                            query={{
                                resource: 'categoryOptionGroups',
                            }}
                            leftHeader={i18n.t(
                                'Available category option groups'
                            )}
                            rightHeader={i18n.t(
                                'Selected category option groups'
                            )}
                            filterPlaceholder={i18n.t(
                                'Filter available category option groups'
                            )}
                            filterPlaceholderPicked={i18n.t(
                                'Filter selected category option groups'
                            )}
                        />
                    </StandardFormField>
                </StandardFormField>
            </StandardFormSection>
            <CustomAttributesSection schemaSection={section} />
        </>
    )
}

export default CategoryOptionGroupSetFormFields
