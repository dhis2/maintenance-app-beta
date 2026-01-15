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
import {
    composeAsyncValidators,
    FormFieldValidator,
} from '../../../lib/form/composeAsyncValidators'
import { ProgramRuleVariable } from '../../../types/generated'
import {
    DataElementField,
    ProgramStageField,
    SourceTypeField,
    TrackedEntityAttributeField,
} from '../fields'
import { ProgramRuleVariableFormDescriptor } from './formDescriptor'

const section = SECTIONS_MAP.programRuleVariable

const NAME_PATTERN = /^[a-zA-Z0-9\s\-._]+$/
const FORBIDDEN_WORDS = ['and', 'or', 'not']

const containsForbiddenWord = (value: string): boolean => {
    const words = value.toLowerCase().match(/\b\w+\b/g) || []
    const forbiddenWordsLower = FORBIDDEN_WORDS.map((word) =>
        word.toLowerCase()
    )
    return words.some((word) => forbiddenWordsLower.includes(word))
}

const namePatternValidator: FormFieldValidator<string> = (value) => {
    if (!value) {
        return undefined
    }
    if (!NAME_PATTERN.test(value)) {
        return i18n.t(
            'Name can only contain letters, numbers, space, dash, dot and underscore'
        )
    }
    return undefined
}

const forbiddenWordsValidator: FormFieldValidator<string> = (value) => {
    if (!value) {
        return undefined
    }
    if (containsForbiddenWord(value)) {
        return i18n.t(
            'Program rule variable name contains forbidden words: and, or, not.'
        )
    }
    return undefined
}

const nameValidator = composeAsyncValidators([
    forbiddenWordsValidator,
    namePatternValidator,
])

export const ProgramRuleVariableFormFields = () => {
    const descriptor =
        useSectionedFormContext<typeof ProgramRuleVariableFormDescriptor>()
    useSyncSelectedSectionWithScroll()
    const form = useForm()
    const { values } = useFormState({ subscription: { values: true } })
    const { input: programStageInput } = useField('programStage')

    const isEdit = Boolean(values.id)

    const sourceType = values.programRuleVariableSourceType
    const programStage = programStageInput.value

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
                    <NameField
                        schemaSection={section}
                        helpText={i18n.t(
                            'Variable name cannot contain the words: and, or, not.'
                        )}
                        customValidator={nameValidator}
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
                    {i18n.t('Configure how this variable works.')}
                </StandardFormSectionDescription>

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
                <StandardFormField>
                    <FieldRFF
                        name="useCodeForOptionSet"
                        type="checkbox"
                        dataTest="useCodeForOptionSet-field"
                        component={CheckboxFieldFF}
                        label={i18n.t(
                            'Show option set code instead of display name (when selection is linked to an option set).'
                        )}
                    />
                </StandardFormField>
            </SectionedFormSection>
        </SectionedFormSections>
    )
}
