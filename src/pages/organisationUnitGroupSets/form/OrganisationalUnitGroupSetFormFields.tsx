import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, RadioFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, Field } from 'react-final-form'
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
import { SECTIONS_MAP } from '../../../lib'
import { DataDimensionField } from '../../dataElementGroupSets/fields'

export const OrganisationalUnitGroupSetFormFields = () => {
    const section = SECTIONS_MAP.organisationUnitGroupSet

    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this organisational unit group set.'
                    )}
                </StandardFormSectionDescription>
                <DefaultIdentifiableFields />
                <StandardFormField>
                    <DescriptionField />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF
                        component={CheckboxFieldFF}
                        name="compulsory"
                        label={i18n.t('Compulsory')}
                        type="checkbox"
                        validateFields={[]}
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF
                        component={CheckboxFieldFF}
                        name="dataDimension"
                        label={i18n.t('Data dimension')}
                        type="checkbox"
                        validateFields={[]}
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF
                        component={CheckboxFieldFF}
                        name="includeSubhierarchyInAnalytics"
                        label={i18n.t('Include subhierarchy in analytics')}
                        type="checkbox"
                        validateFields={[]}
                    />
                </StandardFormField>
            </StandardFormSection>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    <label htmlFor={'organisationUnitGroups'}>
                        {i18n.t('Organisation unit groups')}
                    </label>
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose the groups to include in this organisation unit group set.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <StandardFormField>
                        <ModelTransferField
                            name="organisationUnitGroups"
                            query={{
                                resource: 'organisationUnitGroups',
                                params: {
                                    filter: ['name:ne:default'],
                                },
                            }}
                            leftHeader={i18n.t(
                                'Available organisation unit groups'
                            )}
                            rightHeader={i18n.t(
                                'Selected organisation unit groups'
                            )}
                            filterPlaceholder={i18n.t(
                                'Filter available organisation unit groups'
                            )}
                            filterPlaceholderPicked={i18n.t(
                                'Filter selected organisation unit groups'
                            )}
                        />
                    </StandardFormField>
                </StandardFormField>
            </StandardFormSection>
            <CustomAttributesSection schemaSection={section} />
        </>
    )
}
