import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF, CheckboxFieldFF, InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import {
    DefaultIdentifiableFields,
    DescriptionField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import {
    ColorAndIconField,
    LegendSetField,
    UrlField,
} from '../../dataElements/fields'
import DenominatorFields from './denominatorFields'
import { IndicatorTypeField } from './IndicatorTypeField'
import NumeratorFields from './numeratorFields'

export const IndicatiorFormFields = () => {
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t('Set up the basic information for this indicator.')}
                </StandardFormSectionDescription>

                <DefaultIdentifiableFields />

                <DescriptionField
                    helpText={i18n.t('Explain the purpose of this indicator.')}
                />
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormField>
                    <ColorAndIconField />
                </StandardFormField>

                <StandardFormField>
                    <IndicatorTypeField />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        name="decimals"
                        component={SingleSelectFieldFF}
                        inputWidth="400px"
                        label={i18n.t('Decimals in data output')}
                        options={[0, 1, 2, 3, 4, 5].map((d) => ({
                            label: d.toString(),
                            value: d.toString(),
                        }))}
                        placeholder={i18n.t('Select number of decimals')}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        name="annualized"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t('Annualized')}
                    />
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
                <StandardFormField>
                    <FieldRFF
                        component={InputFieldFF}
                        inputWidth="400px"
                        name="url"
                        label={i18n.t('Url')}
                        helpText={i18n.t(
                            'A web link that provides extra information.'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF<string | undefined>
                        inputWidth="400px"
                        name="aggregateExportCategoryOptionCombo"
                        label={i18n.t('Aggregate export category option combo')}
                        component={InputFieldFF}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF<string | undefined>
                        component={InputFieldFF}
                        name="aggregateExportAttributeOptionCombo"
                        inputWidth="400px"
                        label={i18n.t(
                            'Aggregate export attribute option combo'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={SingleSelectFieldFF}
                        inputWidth="400px"
                        name="attributeValues[0].value"
                        label={i18n.t('Classification')}
                        options={[
                            { label: i18n.t('Input'), value: 'INPUT' },
                            { label: i18n.t('Activity'), value: 'ACTIVITY' },
                            { label: i18n.t('Output'), value: 'OUTPUT' },
                            { label: i18n.t('Impact'), value: 'IMPACT' },
                        ]}
                        placeholder={i18n.t('Select classification')}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF<string | undefined>
                        component={InputFieldFF}
                        inputWidth="400px"
                        name="attributeValues[1].value"
                        label={i18n.t('PEPFAR ID')}
                    />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Numerator')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t('Define and describe the numerator formula.')}
                </StandardFormSectionDescription>

                <NumeratorFields />
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Denominator')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t('Define and describe the denominator formula.')}
                </StandardFormSectionDescription>

                <DenominatorFields />
            </StandardFormSection>
        </>
    )
}
