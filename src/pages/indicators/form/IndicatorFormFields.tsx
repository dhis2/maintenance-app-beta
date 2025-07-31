import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF, CheckboxFieldFF, InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import {
    CustomAttributesSection,
    DefaultIdentifiableFields,
    DescriptionField,
    ModelTransferField,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SECTIONS_MAP, useSectionedFormContext } from '../../../lib'
import { ColorAndIconField } from '../../dataElements/fields'
import DenominatorFields from './DenominatorFields'
import { IndicatorFormDescriptor } from './formDescriptor'
import { IndicatorTypeField } from './IndicatorTypeField'
import NumeratorFields from './NumeratorFields'

const section = SECTIONS_MAP.indicator

export const IndicatorFormFields = () => {
    const { input: decimalsInput, meta: decimalsMeta } = useField('decimals', {
        format: (v) => v?.toString(),
        parse: (v) => (v !== undefined && v !== '' ? parseInt(v) : v),
    })
    const descriptor = useSectionedFormContext<typeof IndicatorFormDescriptor>()

    return (
        <SectionedFormSections>
            <SectionedFormSection
                name={descriptor.getSection('basicInformation').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t('Set up the basic information for this indicator.')}
                </StandardFormSectionDescription>

                <DefaultIdentifiableFields />

                <StandardFormField>
                    <DescriptionField
                        helpText={i18n.t(
                            'Explain the purpose of this indicator.'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={InputFieldFF}
                        inputWidth="400px"
                        name="url"
                        dataTest="formfields-url"
                        type="url"
                        label={i18n.t('Url')}
                        helpText={i18n.t(
                            'A web link that provides extra information.'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <ColorAndIconField />
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection
                name={descriptor.getSection('expressions').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Indicator expressions')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t('Configure the expressions and type of indicator.')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <IndicatorTypeField />
                </StandardFormField>
                <StandardFormField>
                    <NumeratorFields />
                </StandardFormField>
                <StandardFormField>
                    <DenominatorFields />
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection name={descriptor.getSection('options').name}>
                <StandardFormSectionTitle>
                    {i18n.t('Indicator options')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t(
                        'Configure how this indicator is calculated and displayed.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <FieldRFF
                        name="annualized"
                        type="checkbox"
                        dataTest="formfields-annualized"
                        component={CheckboxFieldFF}
                        label={i18n.t('Annualized')}
                    />
                </StandardFormField>
                <StandardFormField>
                    <SingleSelectFieldFF
                        input={decimalsInput}
                        meta={decimalsMeta}
                        dataTest="decimals-field"
                        label={i18n.t('Decimals in data output')}
                        inputWidth="400px"
                        options={[
                            { label: i18n.t('<No value>'), value: '' },
                            ...[0, 1, 2, 3, 4, 5].map((d) => ({
                                label: d.toString(),
                                value: d.toString(),
                            })),
                        ]}
                        placeholder={i18n.t('Select number of decimals')}
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF<string | undefined>
                        inputWidth="400px"
                        dataTest="formfields-aggregateExportCategoryOptionCombo"
                        name="aggregateExportCategoryOptionCombo"
                        label={i18n.t('Aggregate export category option combo')}
                        component={InputFieldFF}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF<string | undefined>
                        component={InputFieldFF}
                        dataTest="formfields-aggregateExportAttributeOptionCombo"
                        name="aggregateExportAttributeOptionCombo"
                        inputWidth="400px"
                        label={i18n.t(
                            'Aggregate export attribute option combo'
                        )}
                    />
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection name={descriptor.getSection('legends').name}>
                <StandardFormSectionTitle>
                    {i18n.t('Legends')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Set up the program indicator legends.')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <ModelTransferField
                        dataTest="legendSets-field"
                        name="legendSets"
                        query={{
                            resource: 'legendSets',
                            params: {
                                filter: ['name:ne:default'],
                                fields: ['id', 'displayName'],
                            },
                        }}
                        leftHeader={i18n.t('Available legends')}
                        rightHeader={i18n.t('Selected legends')}
                        filterPlaceholder={i18n.t('Filter available legends')}
                        filterPlaceholderPicked={i18n.t(
                            'Filter selected legends'
                        )}
                    />
                </StandardFormField>
            </SectionedFormSection>

            <CustomAttributesSection schemaSection={section} sectionedLayout />
        </SectionedFormSections>
    )
}
