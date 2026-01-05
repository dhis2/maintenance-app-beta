import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import {
    SectionedFormSections,
    SectionedFormSection,
    StandardFormField,
    StandardFormSectionTitle,
    NameField,
    StandardFormSectionDescription,
    ShortNameField,
    CodeField,
    DescriptionField,
    ModelTransferField,
} from '../../../components'
import {
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
    useSchemaSectionHandleOrThrow,
    useSchema,
    getConstantTranslation,
} from '../../../lib'
import { ExpressionFields } from './ExpressionFields'
import { PredictorFormDescriptor } from './formDescriptor'
import { NumberField } from './NumberField'
import { OperatorFields } from './OperatorFields'
import { PeriodTypeField } from './PeriodTypeField'
import css from './PredictorFormFields.module.css'

export const PredictorFormFields = () => {
    const schemaSection = useSchemaSectionHandleOrThrow()
    const schema = useSchema(schemaSection.name)
    const descriptor = useSectionedFormContext<typeof PredictorFormDescriptor>()
    useSyncSelectedSectionWithScroll()
    return (
        <SectionedFormSections>
            <SectionedFormSection
                name={descriptor?.getSection('basicInformation')?.name ?? ''}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Set up the basic information for this predictor.')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <NameField schemaSection={schemaSection} />
                </StandardFormField>

                <StandardFormField>
                    <ShortNameField schemaSection={schemaSection} />
                </StandardFormField>

                <StandardFormField>
                    <CodeField schemaSection={schemaSection} />
                </StandardFormField>
                <StandardFormField>
                    <DescriptionField />
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection
                name={descriptor?.getSection('outputDefinition')?.name ?? ''}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Output definition')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Define where predictions will be output')}
                </StandardFormSectionDescription>
                <OperatorFields />
                <StandardFormField>
                    <PeriodTypeField />
                </StandardFormField>
                <div className={css.subtitle}>
                    {i18n.t('Organisation unit levels')}
                </div>
                <StandardFormField>
                    <ModelTransferField
                        name="organisationUnitLevels"
                        query={{
                            resource: 'organisationUnitLevels',
                        }}
                        leftHeader={i18n.t(
                            'Available organisation unit levels'
                        )}
                        rightHeader={i18n.t(
                            'Selected organisation unit levels'
                        )}
                        filterPlaceholder={i18n.t(
                            'Filter available organisation unit levels'
                        )}
                        filterPlaceholderPicked={i18n.t(
                            'Filter selected organisation unit levels options'
                        )}
                        maxSelections={Infinity}
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF
                        required
                        component={SingleSelectFieldFF}
                        inputWidth="400px"
                        name="organisationUnitDescendants"
                        label={i18n.t('Organisation units providing data')}
                        options={schema?.properties?.organisationUnitDescendants?.constants?.map(
                            (opt) => ({
                                value: opt,
                                label: getConstantTranslation(opt),
                            })
                        )}
                    />
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection
                name={descriptor?.getSection('predictionLogic')?.name ?? ''}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Prediction logic')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Define how predictions will be calculated')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <NumberField
                        fieldName="sequentialSampleCount"
                        label={i18n.t('Sequential sample count')}
                        required={true}
                    />
                </StandardFormField>
                <StandardFormField>
                    <NumberField
                        fieldName="annualSampleCount"
                        label={i18n.t('Annual sample count')}
                        required={true}
                    />
                </StandardFormField>
                <StandardFormField>
                    <NumberField
                        fieldName="sequentialSkipCount"
                        label={i18n.t('Sequential skip count')}
                        required={false}
                    />
                </StandardFormField>
                <ExpressionFields
                    fieldName={'generator'}
                    expressionName={i18n.t('Generator')}
                    expressionLabel={i18n.t('Label placeholder')}
                    expressionEditText={i18n.t('Edit generator expression')}
                    validationResource="predictors/expression/description"
                    showMissingValueStrategy={true}
                />
                <ExpressionFields
                    fieldName={'sampleSkipTest'}
                    expressionName={i18n.t('Sample skip test')}
                    expressionLabel={i18n.t('Label placeholder')}
                    expressionEditText={i18n.t(
                        'Edit sample skip test expression'
                    )}
                    validationResource="predictors/expression/description"
                    showMissingValueStrategy={false}
                />
            </SectionedFormSection>
        </SectionedFormSections>
    )
}
