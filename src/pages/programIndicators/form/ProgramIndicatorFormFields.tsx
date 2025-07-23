import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, InputFieldFF, SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, Field, useField } from 'react-final-form'
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
import { ExpressionBuilderField } from '../../../components/metadataFormControls/ExpressionBuilder/ExpressionBuilderField'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import {
    getConstantTranslation,
    SECTIONS_MAP,
    useSchema,
    useSectionedFormContext,
} from '../../../lib'
import { ColorAndIconField } from '../../dataElements/fields'
import { AnalyticsPeriodBoundariesField } from './AnalyticsPeriodBoundariesField'
import { ProgramIndicatorFormDescriptor } from './formDescriptor'
import { OrgUnitField } from './OrgUnitField'

const section = SECTIONS_MAP.programIndicator

export const ProgramIndicatorsFormFields = () => {
    const { input: decimalsInput, meta: decimalsMeta } = useField('decimals', {
        format: (v) => v?.toString(),
        parse: (v) => v && parseInt(v),
    })
    const programFilters = [
        'id,displayName,programType,programTrackedEntityAttributes[trackedEntityAttribute[id,displayName,valueType]]',
    ] as const
    const descriptor =
        useSectionedFormContext<typeof ProgramIndicatorFormDescriptor>()

    const { apiVersion } = useConfig()
    const hasPiDisaggregation = apiVersion >= 42

    const schema = useSchema(SECTIONS_MAP.programIndicator.name)
    return (
        <SectionedFormSections>
            <SectionedFormSection
                name={descriptor.getSection('basicInformation').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this program indicator.'
                    )}
                </StandardFormSectionDescription>
                <DefaultIdentifiableFields />
                <StandardFormField>
                    <DescriptionField
                        helpText={i18n.t(
                            'Explain the purpose of this program indicator.'
                        )}
                    />
                </StandardFormField>
                <StandardFormField>
                    <ColorAndIconField />
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection
                name={descriptor.getSection('configuration').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Configuration')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose which program and which data types this program indicator applies to.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <ModelSingleSelectFormField
                        required
                        inputWidth="400px"
                        dataTest="programs-field"
                        name="program"
                        label={i18n.t('Program (required)')}
                        query={{
                            resource: 'programs',
                            params: {
                                fields: programFilters.concat(),
                            },
                        }}
                    />
                </StandardFormField>
                <StandardFormField dataTest="aggregation-type-field">
                    <FieldRFF
                        component={SingleSelectFieldFF}
                        inputWidth="400px"
                        label={i18n.t('Aggregation type')}
                        name="aggregationType"
                        options={
                            schema.properties.aggregationType.constants?.map(
                                (option) => ({
                                    value: option,
                                    label: getConstantTranslation(option),
                                })
                            ) ?? []
                        }
                    />
                </StandardFormField>
                <StandardFormField dataTest="analytics-type-field">
                    <FieldRFF
                        required
                        component={SingleSelectFieldFF}
                        inputWidth="400px"
                        label={i18n.t('Analytics type (required)')}
                        name="analyticsType"
                        options={
                            schema.properties.analyticsType.constants?.map(
                                (option) => ({
                                    value: option,
                                    label: getConstantTranslation(option),
                                })
                            ) ?? []
                        }
                    />
                </StandardFormField>
                <StandardFormField>
                    <OrgUnitField />
                </StandardFormField>
                <StandardFormField dataTest="decimals-field">
                    <SingleSelectFieldFF
                        input={decimalsInput}
                        meta={decimalsMeta}
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
            </SectionedFormSection>
            <SectionedFormSection
                name={descriptor.getSection('expression').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Expression')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Configure the program indicator expression.')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <ExpressionBuilderField
                        dataTest="formfields-expression"
                        name="expression"
                    />
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection name={descriptor.getSection('filter').name}>
                <StandardFormSectionTitle>
                    {i18n.t('Filter')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Configure the program indicator filter that controls what data will be evaluated bt the main expression.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <ExpressionBuilderField
                        dataTest="formfields-filter"
                        name="filter"
                    />
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection
                name={descriptor.getSection('periodBoundaries').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Period boundaries')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up time constraints, which determine what data will be evaluated.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <AnalyticsPeriodBoundariesField />
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection
                name={descriptor.getSection('advancedOptions').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Advanced options')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up advanced properties for this program indicator.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <Field
                        inputWidth="400px"
                        name="displayInForm"
                        type="checkbox"
                        dataTest="formfields-displayInForm"
                        component={CheckboxFieldFF}
                        label={i18n.t(
                            'Show program indicators in data entry forms'
                        )}
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF
                        dataTest="formfields-aggregateExportCategoryOptionCombo"
                        inputWidth="400px"
                        component={InputFieldFF}
                        name="aggregateExportCategoryOptionCombo"
                        label={i18n.t(
                            'Category option combination for aggregate data export'
                        )}
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF
                        inputWidth="400px"
                        dataTest="formfields-aggregateExportAttributeOptionCombo"
                        component={InputFieldFF}
                        name="aggregateExportAttributeOptionCombo"
                        label={i18n.t(
                            'Attribute option combination for aggregate data export'
                        )}
                    />
                </StandardFormField>
                {hasPiDisaggregation && (
                    <StandardFormField>
                        <FieldRFF
                            inputWidth="400px"
                            dataTest="formfields-aggregateExportDataElement"
                            component={InputFieldFF}
                            name="aggregateExportDataElement"
                            label={i18n.t(
                                'Data element for aggregate data export'
                            )}
                        />
                    </StandardFormField>
                )}
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
                            },
                        }}
                        leftHeader={i18n.t('Available legends')}
                        rightHeader={i18n.t('Selected legends')}
                        filterPlaceholder={i18n.t('Filter available legends')}
                        filterPlaceholderPicked={i18n.t(
                            'Filter selected legends'
                        )}
                        maxSelections={Infinity}
                    />
                </StandardFormField>
            </SectionedFormSection>
            <CustomAttributesSection schemaSection={section} sectionedLayout />
        </SectionedFormSections>
    )
}
