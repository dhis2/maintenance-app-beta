import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React, { useCallback } from 'react'
import {
    Field as FieldRFF,
    useField,
    useForm,
    useFormState,
} from 'react-final-form'
import {
    NameField,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
    ValueTypeField,
} from '../../../components'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import {
    SECTIONS_MAP,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import { ProgramRuleVariable } from '../../../types/generated'
import {
    DataElementField,
    ProgramStageField,
    SourceTypeField,
    TrackedEntityAttributeField,
} from '../fields'
import { ProgramRuleVariableFormDescriptor } from './formDescriptor'

const section = SECTIONS_MAP.programRuleVariable

export const ProgramRuleVariableFormFields = () => {
    const descriptor =
        useSectionedFormContext<typeof ProgramRuleVariableFormDescriptor>()
    useSyncSelectedSectionWithScroll()
    const form = useForm()
    const { values } = useFormState({ subscription: { values: true } })
    const { input: sourceTypeInput } = useField('programRuleVariableSourceType')
    const { input: programStageInput } = useField('programStage')

    const isEdit = Boolean(values.id)

    const clearProgramDependentFields = useCallback(() => {
        form.batch(() => {
            form.change('programStage', undefined)
            form.change('dataElement', undefined)
            form.change('trackedEntityAttribute', undefined)
        })
    }, [form])

    const clearSourceTypeDependentFields = useCallback(() => {
        form.batch(() => {
            form.change('programStage', undefined)
            form.change('dataElement', undefined)
            form.change('trackedEntityAttribute', undefined)
            form.change('valueType', undefined)
        })
    }, [form])

    const clearProgramStageDataElement = useCallback(() => {
        form.change('dataElement', undefined)
    }, [form])
    const sourceType = sourceTypeInput.value
    const programStage = programStageInput.value

    const {
        DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE,
        DATAELEMENT_NEWEST_EVENT_PROGRAM,
        DATAELEMENT_CURRENT_EVENT,
        DATAELEMENT_PREVIOUS_EVENT,
        TEI_ATTRIBUTE,
        CALCULATED_VALUE,
    } = ProgramRuleVariable.programRuleVariableSourceType

    const shouldShowProgramStage =
        sourceType === DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE
    const shouldShowTrackedEntityAttribute = sourceType === TEI_ATTRIBUTE
    const shouldShowValueType = sourceType === CALCULATED_VALUE
    const shouldShowDataElements =
        (sourceType === DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE &&
            !!programStage?.id) ||
        sourceType === DATAELEMENT_NEWEST_EVENT_PROGRAM ||
        sourceType === DATAELEMENT_CURRENT_EVENT ||
        sourceType === DATAELEMENT_PREVIOUS_EVENT

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
                        'Set up the basic information for this program rule variable.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <NameField schemaSection={section} />
                </StandardFormField>

                <StandardFormField>
                    <ModelSingleSelectFormField
                        required
                        inputWidth="400px"
                        dataTest="program-field"
                        name="program"
                        label={i18n.t('Program (required)')}
                        query={{
                            resource: 'programs',
                            params: {
                                fields: ['id', 'displayName'],
                                paging: false,
                            },
                        }}
                        disabled={isEdit}
                        onChange={clearProgramDependentFields}
                        helpText={
                            isEdit
                                ? i18n.t(
                                      'Program cannot be changed after creation'
                                  )
                                : undefined
                        }
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        name="useCodeForOptionSet"
                        type="checkbox"
                        dataTest="useCodeForOptionSet-field"
                        component={CheckboxFieldFF}
                        label={i18n.t('Use code for option set')}
                    />
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
                        'Configure the source and data elements for this program rule variable.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField dataTest="sourceType-field">
                    <SourceTypeField
                        onChange={clearSourceTypeDependentFields}
                    />
                </StandardFormField>

                {shouldShowProgramStage && (
                    <StandardFormField>
                        <ProgramStageField
                            onChange={clearProgramStageDataElement}
                        />
                    </StandardFormField>
                )}

                {shouldShowDataElements && (
                    <StandardFormField>
                        <DataElementField />
                    </StandardFormField>
                )}

                {shouldShowTrackedEntityAttribute && (
                    <StandardFormField>
                        <TrackedEntityAttributeField />
                    </StandardFormField>
                )}

                {shouldShowValueType && (
                    <StandardFormField dataTest="valueType-field">
                        <ValueTypeField />
                    </StandardFormField>
                )}
            </SectionedFormSection>
        </SectionedFormSections>
    )
}
