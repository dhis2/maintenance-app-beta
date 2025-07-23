import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF, CheckboxFieldFF, InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import {
    CustomAttributesSection,
    DefaultIdentifiableFields,
    DescriptionField,
    ModelTransferField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SECTIONS_MAP } from '../../../lib'
import { ColorAndIconField } from '../../dataElements/fields'
import DenominatorFields from './DenominatorFields'
import { IndicatorTypeField } from './IndicatorTypeField'
import NumeratorFields from './NumeratorFields'

export const IndicatiorFormFields = () => {
    const { input: decimalsInput, meta: decimalsMeta } = useField('decimals', {
        format: (v) => v?.toString(),
        parse: (v) => v && parseInt(v),
    })

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
                    <ModelTransferField
                        dataTest="legendset-transfer"
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
            </StandardFormSection>
            <CustomAttributesSection schemaSection={SECTIONS_MAP.indicator} />

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
