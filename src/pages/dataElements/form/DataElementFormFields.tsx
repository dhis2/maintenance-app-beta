import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    StandardFormField,
} from '../../../components'
import {
    CodeField,
    DescriptionField,
    NameField,
    ShortNameField,
} from '../../../components/formFields'
import { SCHEMA_SECTIONS } from '../../../lib'
import {
    AggregationLevelsField,
    AggregationTypeField,
    CategoryComboField,
    ColorAndIconField,
    CustomAttributes,
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
    const schemaSection = SCHEMA_SECTIONS.dataElement
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t('Set up the information for this data element')}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <NameField schemaSection={schemaSection} />
                </StandardFormField>

                <StandardFormField>
                    <ShortNameField schemaSection={schemaSection} />
                </StandardFormField>

                <StandardFormField>
                    <FormNameField />
                </StandardFormField>

                <StandardFormField>
                    <CodeField schemaSection={schemaSection} />
                </StandardFormField>

                <StandardFormField>
                    <DescriptionField schemaSection={schemaSection} />
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
                    {i18n.t('LegendSet')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t(
                        'Visualize values for this data element in Analytics app. Multiple legendSet can be applied.'
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
                        'By default, the aggregation will start at the lowest assigned organisation unit. If you for example select "Chiefdom", it means that "Chiefdom", "District" and "National" aggregates use "Chiefdom" (the highest aggregation level available) as the data source, and PHU data will not be included. PHU will still be available for the PHU level, but not included in the aggregations to the levels above.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <AggregationLevelsField />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Custom attributes')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t('Custom fields for your DHIS2 instance')}
                </StandardFormSectionDescription>

                <CustomAttributes />
            </StandardFormSection>
        </>
    )
}
