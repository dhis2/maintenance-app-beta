import i18n from '@dhis2/d2-i18n'
import { RadioFieldFF } from '@dhis2/ui'
import {capitalize} from "lodash";
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
import {SchemaName, SECTIONS_MAP, useSchema} from '../../../lib'
import {getSchemaPropertyForPath} from "../../../lib/models/path";

function CategoryOptionGroupFormFields() {
    const section = SECTIONS_MAP.categoryOptionGroup
    const schema = useSchema(SchemaName.categoryOptionGroup)

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
                        {getSchemaPropertyForPath(schema, 'dataDimensionType')?.constants?.map(dataDimansionType =>
                            <Field<string | undefined>
                                name="dataDimensionType"
                                key={dataDimansionType}
                                component={RadioFieldFF}
                                label={i18n.t(capitalize(dataDimansionType))}
                                type="radio"
                                value={dataDimansionType}
                            />
                        )}
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
