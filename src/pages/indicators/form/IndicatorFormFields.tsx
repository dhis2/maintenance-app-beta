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
import {
    SECTIONS_MAP,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
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
    useSyncSelectedSectionWithScroll()

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
                    {i18n.t('Calculation details')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t(
                        "Define how the indicator is calculated and how it's result will be displayed."
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <NumeratorFields />
                </StandardFormField>
                <StandardFormField>
                    <DenominatorFields />
                </StandardFormField>

                <StandardFormField>
                    <IndicatorTypeField
                        helpText={i18n.t(
                            'Select how the indicator result should be expressed (per cent, per thousand, etc.)'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        name="annualized"
                        type="checkbox"
                        dataTest="formfields-annualized"
                        component={CheckboxFieldFF}
                        label={i18n.t('Use annualized calculation')}
                    />
                </StandardFormField>

                <StandardFormField>
                    <SingleSelectFieldFF
                        input={decimalsInput}
                        meta={decimalsMeta}
                        helpText={i18n.t(
                            'Select how many decimal places to display in outputs for this indicator'
                        )}
                        dataTest="decimals-field"
                        label={i18n.t('Number of decimal places to show')}
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
            </SectionedFormSection>
            <SectionedFormSection name={descriptor.getSection('legends').name}>
                <StandardFormSectionTitle>
                    {i18n.t('Legends')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Select legends to visually categorize values for this indicator in data entry and analytics apps.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    {/*this still has the new text and not the old one*/}

                    <ModelTransferField
                        dataTest="legendSets-field"
                        name="legendSets"
                        leftHeader={i18n.t('Available legends')}
                        rightHeader={i18n.t('Selected legends')}
                        filterPlaceholder={i18n.t('Filter available legends')}
                        filterPlaceholderPicked={i18n.t(
                            'Filter selected legends'
                        )}
                        query={{
                            resource: 'legendSets',
                            params: {
                                filter: ['name:ne:default'],
                                fields: ['id', 'displayName'],
                            },
                        }}
                        enableOrderChange={true}
                    />
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection
                name={descriptor.getSection('mappingSettings').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Mapping Settings')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t(
                        'Configure how this indicator links to specific category and attribute combinations for data export.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <FieldRFF<string | undefined>
                        inputWidth="400px"
                        dataTest="formfields-aggregateExportCategoryOptionCombo"
                        name="aggregateExportCategoryOptionCombo"
                        label={i18n.t(
                            'Category option combination for aggregate data export'
                        )}
                        helpText={i18n.t(
                            'Map this indicator to a specific category option combinations when exporting aggregate data.'
                        )}
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
                            'Attribute option combination for aggregate data export'
                        )}
                        helpText={i18n.t(
                            'Map this indicator to a specific attribute option combinations when exporting aggregate data.'
                        )}
                    />
                </StandardFormField>
            </SectionedFormSection>
            <CustomAttributesSection schemaSection={section} sectionedLayout />
        </SectionedFormSections>
    )
}
