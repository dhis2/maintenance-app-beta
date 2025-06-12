import i18n from '@dhis2/d2-i18n'
import {
    CheckboxFieldFF,
    InputFieldFF,
    SingleSelectField,
    SingleSelectOption,
    TextAreaFieldFF,
} from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, Field, useField } from 'react-final-form'
import {
    DefaultIdentifiableFields,
    DescriptionField,
    ModelTransferField,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { ModelSingleSelectField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { getConstantTranslation, SECTIONS_MAP, useSchema } from '../../../lib'
import { DisplayableModel } from '../../../types/models'
import { ColorAndIconField } from '../../dataElements/fields'
import { AnalyticsPeriodBoundariesField } from './AnalyticsPeriodBoundariesField'
import { OrgUnitField } from './OrgUnitField'

export const ProgramIndicatorsFormFields = () => {
    const { input: decimalsInput } = useField('decimals')
    const { input: aggregationTypeInput } = useField('aggregationType')
    const { input: analyticsTypeInput } = useField('analyticsType')
    const { input: programInput, meta: programMeta } = useField('program')
    const programFilters = ['id,displayName'] as const

    const schema = useSchema(SECTIONS_MAP.programIndicator.name)
    return (
        <>
            <SectionedFormSections>
                <SectionedFormSection name="programIndicatorDetails">
                    <StandardFormSectionTitle>
                        {i18n.t('Basic information')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Set up the basic information for this program indicator.'
                        )}
                    </StandardFormSectionDescription>
                    <StandardFormField>
                        <ModelSingleSelectField<DisplayableModel>
                            query={{
                                resource: 'programs',
                                params: {
                                    fields: programFilters.concat(),
                                },
                            }}
                            input={programInput}
                            meta={programMeta}
                            label={i18n.t('Program')}
                            required
                        />
                    </StandardFormField>
                    <DefaultIdentifiableFields />
                    <StandardFormField>
                        <ColorAndIconField />
                    </StandardFormField>
                    <StandardFormField>
                        <DescriptionField
                            helpText={i18n.t(
                                'Explain the purpose of this program indicator.'
                            )}
                        />
                    </StandardFormField>
                    <StandardFormField>
                        <SingleSelectField
                            selected={decimalsInput.value.toString()}
                            onChange={({ selected }) => {
                                decimalsInput.onChange(selected)
                                decimalsInput.onBlur()
                            }}
                            label={i18n.t('Decimals in data output')}
                        >
                            <SingleSelectOption
                                label={'<No value>'}
                                value={''}
                            />
                            {['0', '1', '2', '3', '4', '5'].map((option) => (
                                <SingleSelectOption
                                    key={option}
                                    label={option}
                                    value={option}
                                />
                            ))}
                        </SingleSelectField>
                    </StandardFormField>
                    <StandardFormField>
                        <SingleSelectField
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
                    <StandardFormField>
                        <SingleSelectField
                            selected={analyticsTypeInput.value}
                            onChange={({ selected }) => {
                                analyticsTypeInput.onChange(selected)
                                analyticsTypeInput.onBlur()
                            }}
                            label={i18n.t('Analytics type')}
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
                    <OrgUnitField />
                    <AnalyticsPeriodBoundariesField />
                    <StandardFormField>
                        <Field
                            name="displayInForm"
                            type="checkbox"
                            component={CheckboxFieldFF}
                            label={i18n.t('Display in form')}
                        />
                    </StandardFormField>
                    <StandardFormField>
                        <ModelTransferField
                            name="legendSets"
                            query={{
                                resource: 'legendSets',
                                params: {
                                    filter: ['name:ne:default'],
                                },
                            }}
                            leftHeader={i18n.t('Available legends')}
                            rightHeader={i18n.t('Selected legends')}
                            filterPlaceholder={i18n.t(
                                'Filter available legends'
                            )}
                            filterPlaceholderPicked={i18n.t(
                                'Filter selected legends'
                            )}
                            maxSelections={Infinity}
                        />
                    </StandardFormField>
                    <FieldRFF
                        component={InputFieldFF}
                        name="aggregateExportCategoryOptionCombo"
                        label={i18n.t(
                            'Category option combination for aggregate data export'
                        )}
                    />
                    <FieldRFF
                        component={InputFieldFF}
                        name="aggregateExportAttributeOptionCombo"
                        label={i18n.t(
                            'Attribute option combination for aggregate data export'
                        )}
                    />
                    <FieldRFF
                        component={InputFieldFF}
                        name="aggregateExportDataElement"
                        label={i18n.t(
                            'Data element for aggregate data export\n'
                        )}
                    />
                </SectionedFormSection>
                <SectionedFormSection name="editExpression">
                    <StandardFormSectionTitle>
                        {i18n.t('Edit expression')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'The expression defines how the indicator is calculated.'
                        )}
                        <br />
                        {i18n.t(
                            "Tip: use d2:condition('bool-expr',true-val,false-val) d2:daysBetween(date,date) d2:zing(x) d2:oizp(x)"
                        )}
                    </StandardFormSectionDescription>
                    <StandardFormField>
                        <FieldRFF
                            component={TextAreaFieldFF}
                            inputWidth="400px"
                            name="expression"
                            label={i18n.t('Expression')}
                        />
                    </StandardFormField>
                </SectionedFormSection>
                <SectionedFormSection name="editFilter">
                    <StandardFormSectionTitle>
                        {i18n.t('Edit filter')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'The filter is applied to events and filters the data source used for the calculation of the indicator. The filter must evaluate to either true or false. Use single quotes for text values. Use option codes for option set references.'
                        )}
                        <br />
                        {i18n.t(
                            "Tip: use d2:condition('bool-expr',true-val,false-val) d2:daysBetween(date,date) d2:zing(x) d2:oizp(x)"
                        )}
                    </StandardFormSectionDescription>
                    <StandardFormField>
                        <FieldRFF
                            component={TextAreaFieldFF}
                            inputWidth="400px"
                            name="filter"
                            label={i18n.t('Filter')}
                        />
                    </StandardFormField>
                </SectionedFormSection>
            </SectionedFormSections>
        </>
    )
}
