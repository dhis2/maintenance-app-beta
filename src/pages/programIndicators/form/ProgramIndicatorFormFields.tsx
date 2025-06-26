import i18n from '@dhis2/d2-i18n'
import {
    CheckboxFieldFF,
    InputFieldFF,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
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
import { ExpressionBuilder } from '../../../components/ExpressionBuilder/ExpressionBuilder'
import { ModelSingleSelectField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { getConstantTranslation, SECTIONS_MAP, useSchema } from '../../../lib'
import { DisplayableModel } from '../../../types/models'
import { ColorAndIconField } from '../../dataElements/fields'
import { AnalyticsPeriodBoundariesField } from './AnalyticsPeriodBoundariesField'
import { OrgUnitField } from './OrgUnitField'

const section = SECTIONS_MAP.programIndicator

export const ProgramIndicatorsFormFields = () => {
    const { input: decimalsInput } = useField('decimals')
    const { input: aggregationTypeInput } = useField('aggregationType')
    const { input: analyticsTypeInput } = useField('analyticsType')
    const { input: programInput, meta: programMeta } = useField('program')
    const programFilters = [
        'id,displayName,programType,programTrackedEntityAttributes[trackedEntityAttribute[id,displayName,valueType]]',
    ] as const

    const schema = useSchema(SECTIONS_MAP.programIndicator.name)
    return (
        <SectionedFormSections>
            <SectionedFormSection name="basicInformation">
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
            <SectionedFormSection name="configuration">
                <StandardFormSectionTitle>
                    {i18n.t('Configuration')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose which program and which data types this program indicator applies to.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <ModelSingleSelectField<DisplayableModel>
                        inputWidth="400px"
                        dataTest="programs-field"
                        query={{
                            resource: 'programs',
                            params: {
                                fields: programFilters.concat(),
                            },
                        }}
                        input={programInput}
                        meta={programMeta}
                        label={i18n.t('Program (required)')}
                        required
                    />
                </StandardFormField>
                <StandardFormField dataTest="aggregation-type-field">
                    <SingleSelectField
                        inputWidth="400px"
                        selected={aggregationTypeInput.value}
                        onChange={({ selected }) => {
                            aggregationTypeInput.onChange(selected)
                            aggregationTypeInput.onBlur()
                        }}
                        label={i18n.t('Aggregation type')}
                    >
                        {schema.properties.aggregationType.constants?.map(
                            (option) => (
                                <SingleSelectOption
                                    key={option}
                                    label={getConstantTranslation(option)}
                                    value={option}
                                />
                            )
                        )}
                    </SingleSelectField>
                </StandardFormField>
                <StandardFormField dataTest="analytics-type-field">
                    <SingleSelectField
                        required
                        selected={analyticsTypeInput.value}
                        inputWidth="400px"
                        onChange={({ selected }) => {
                            analyticsTypeInput.onChange(selected)
                            analyticsTypeInput.onBlur()
                        }}
                        label={i18n.t('Analytics type (required)')}
                    >
                        {schema.properties.analyticsType.constants?.map(
                            (option) => (
                                <SingleSelectOption
                                    key={option}
                                    label={getConstantTranslation(option)}
                                    value={option}
                                />
                            )
                        )}
                    </SingleSelectField>
                </StandardFormField>
                <StandardFormField>
                    <OrgUnitField />
                </StandardFormField>
                <StandardFormField dataTest="decimals-field">
                    <SingleSelectField
                        inputWidth="400px"
                        selected={decimalsInput.value.toString()}
                        onChange={({ selected }) => {
                            decimalsInput.onChange(parseInt(selected))
                            decimalsInput.onBlur()
                        }}
                        label={i18n.t('Decimals in data output')}
                    >
                        <SingleSelectOption label={'<No value>'} value={''} />
                        {['0', '1', '2', '3', '4', '5'].map((option) => (
                            <SingleSelectOption
                                key={option}
                                label={option}
                                value={option}
                            />
                        ))}
                    </SingleSelectField>
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection name="expression">
                <StandardFormSectionTitle>
                    {i18n.t('Expression')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Configure the program indicator expression.')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <FieldRFF
                        dataTest="formfields-expression"
                        component={ExpressionBuilder}
                        inputWidth="400px"
                        name="expression"
                    />
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection name="filter">
                <StandardFormSectionTitle>
                    {i18n.t('Filter')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Configure the program indicator filter that controls what data will be evaluated bt the main expression.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <FieldRFF
                        dataTest="formfields-filter"
                        component={ExpressionBuilder}
                        inputWidth="400px"
                        name="filter"
                    />
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection name="periodBoundaries">
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
            <SectionedFormSection name="advancedOptions">
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
                {/*<StandardFormField>*/}
                {/*    <FieldRFF*/}
                {/*        dataTest="formfields-aggregateExportDataElement"*/}
                {/*        component={InputFieldFF}*/}
                {/*        name="aggregateExportDataElement"*/}
                {/*        label={i18n.t(*/}
                {/*            'Data element for aggregate data export'*/}
                {/*        )}*/}
                {/*    />*/}
                {/*</StandardFormField>*/}
            </SectionedFormSection>
            <SectionedFormSection name="legends">
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
            <CustomAttributesSection
                schemaSection={section}
                useSectionedLayout
            />
        </SectionedFormSections>
    )
}
