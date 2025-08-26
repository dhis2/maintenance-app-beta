import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, RadioFieldFF } from '@dhis2/ui'
import { capitalize } from 'lodash'
import React from 'react'
import { Field } from 'react-final-form'
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
} from '../../../components'
import { SchemaName, SECTIONS_MAP, useSchema } from '../../../lib'
import { getSchemaPropertyForPath } from '../../../lib/models/path'

export const CategoryFormFields = () => {
    const section = SECTIONS_MAP.category
    const schema = useSchema(SchemaName.category)

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
                    helpText={i18n.t('Explain the purpose of this category.')}
                />
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Data configuration')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose how this category will be used to capture and analyze data.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <HorizontalFieldGroup
                        label={'Data dimension type (required)'}
                    >
                        {getSchemaPropertyForPath(
                            schema,
                            'dataDimensionType'
                        )?.constants?.map((dataDimansionType) => (
                            <Field<string | undefined>
                                name="dataDimensionType"
                                key={dataDimansionType}
                                component={RadioFieldFF}
                                label={i18n.t(capitalize(dataDimansionType))}
                                type="radio"
                                value={dataDimansionType}
                            />
                        ))}
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
                    <label htmlFor={'categoryOptions'}>
                        {i18n.t('Category options')}
                    </label>
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Choose the options to include in this category.')}
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
            </StandardFormSection>
            <CustomAttributesSection schemaSection={section} />
        </>
    )
}
