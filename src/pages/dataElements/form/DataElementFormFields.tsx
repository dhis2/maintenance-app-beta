import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    StandardFormField,
} from '../../../components'
import { CustomAttributes } from './CustomAttributes'
import {
    AggregationLevelsField,
    AggregationTypeField,
    CategoryComboField,
    CodeField,
    ColorAndIconField,
    DescriptionField,
    DomainField,
    FieldMaskField,
    FormNameField,
    LegendSetField,
    NameField,
    OptionSetCommentField,
    OptionSetField,
    ShortNameField,
    UrlField,
    ValueTypeField,
    ZeroIsSignificantField,
} from './fields'

export function DataElementFormFields() {
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
                    <NameField />
                </StandardFormField>

                <StandardFormField>
                    <ShortNameField />
                </StandardFormField>

                <StandardFormField>
                    <CodeField />
                </StandardFormField>

                <StandardFormField>
                    <DescriptionField />
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
                    <FormNameField />
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
                    {`
                        @TODO(DataElementForm): Help text to describe the aggregation levels
                          functionality. It appears as if this section hasn't been
                          finalized yet by Joe, so I guess we'll have to talk about
                          this particluar part.
                    `}
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
