import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    AggregationTypeField,
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    StandardFormField,
    CustomAttributesSection,
    DefaultIdentifiableFields,
    DescriptionField,
} from '../../../components'
import { SCHEMA_SECTIONS } from '../../../lib'
import {
    AggregationLevelsField,
    CategoryComboField,
    ColorAndIconField,
    DomainField,
    FieldMaskField,
    FormNameField,
    LegendSetField,
    OptionSetCommentField,
    OptionSetField,
    UrlField,
    ValueTypeField,
    ZeroIsSignificantField,
} from '../fields'

export function DataElementFormFields() {
    const section = SCHEMA_SECTIONS.dataElement
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t('Set up the information for this data element.')}
                </StandardFormSectionDescription>

                <DefaultIdentifiableFields />

                <StandardFormField>
                    <FormNameField />
                </StandardFormField>

                <StandardFormField>
                    <DescriptionField
                        helpText={i18n.t(
                            'Explain the purpose of this data element.'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <UrlField />
                </StandardFormField>

                <StandardFormField>
                    <ColorAndIconField />
                </StandardFormField>

                <StandardFormField>
                    <FieldMaskField />
                </StandardFormField>

                <StandardFormField>
                    <ZeroIsSignificantField />
                </StandardFormField>

                <StandardFormField>
                    <DomainField />
                </StandardFormField>

                <StandardFormField>
                    <ValueTypeField />
                </StandardFormField>

                <StandardFormField>
                    <AggregationTypeField />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Disaggregation and Option sets')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t('Set up disaggregation and predefined options.')}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <CategoryComboField />
                </StandardFormField>

                <StandardFormField>
                    <OptionSetField />
                </StandardFormField>

                <StandardFormField>
                    <OptionSetCommentField />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Legend set')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t(
                        'Visualize values for this data element in Analytics app. Multiple legends can be applied.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <LegendSetField />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Aggregation levels')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t(
                        'By default, aggregation starts at the lowest assigned organisation unit. You can override this by choosing a different level. Choosing a higher level means that data from lower levels will not be included in the aggregation.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <AggregationLevelsField />
                </StandardFormField>
            </StandardFormSection>

            <CustomAttributesSection schemaSection={section} />
        </>
    )
}
