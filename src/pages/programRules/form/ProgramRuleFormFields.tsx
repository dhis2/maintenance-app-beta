import i18n from '@dhis2/d2-i18n'
import { InputFieldFF, NoticeBox } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField, useFormState } from 'react-final-form'
import type { FieldMetaState } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    ExpressionBuilderEntry,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { PaddedContainer } from '../../../components/ExpressionBuilder/PaddedContainer'
import { DescriptionField, NameField } from '../../../components/form/fields'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import {
    useSchemaSectionHandleOrThrow,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import { ProgramRuleActionsFormContents } from './actions/ProgramRuleActionsFormContents'
import { ProgramRuleFormDescriptor } from './formDescriptor'

export const ProgramRuleFormFields = () => {
    const schemaSection = useSchemaSectionHandleOrThrow()
    const descriptor =
        useSectionedFormContext<typeof ProgramRuleFormDescriptor>()
    useSyncSelectedSectionWithScroll()
    const { values } = useFormState({ subscription: { values: true } })
    const modelId = useParams().id

    const { input, meta } = useField('priority', {
        parse: (value?: string) =>
            value === undefined || value === '' ? undefined : parseFloat(value),
        type: 'number',
        format: (value) =>
            value === undefined || value === null ? '' : value.toString(),
    })

    const { input: programInput } = useField('program')
    const isEdit = Boolean(values.id)

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
                        'Set up the basic information for this program rule.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <NameField
                        schemaSection={schemaSection}
                        helpText={i18n.t(
                            'Only used for managing metadata, not shown with rule output'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <DescriptionField
                        helpText={i18n.t(
                            'Explain the purpose of this program rule. Not shown with rule output.'
                        )}
                    />
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
                                fields: ['id', 'displayName', 'programType'],
                                paging: false,
                            },
                        }}
                        disabled={isEdit}
                    />
                </StandardFormField>

                {programInput?.value?.id &&
                    programInput?.value?.programType !==
                        'WITHOUT_REGISTRATION' && (
                        <StandardFormField>
                            <ModelSingleSelectFormField
                                inputWidth="400px"
                                dataTest="program-stage-field"
                                name="programStage"
                                label={i18n.t('Program stages to trigger rule')}
                                query={{
                                    resource: 'programStages',
                                    params: {
                                        fields: ['id', 'displayName'],
                                        filter: [
                                            `program.id:eq:${programInput.value.id}`,
                                        ],
                                        paging: false,
                                    },
                                }}
                                showNoValueOption={{
                                    value: '',
                                    label: i18n.t('All program stages'),
                                }}
                                helpText={i18n.t(
                                    'Select a specific program stage or leave as "All program stages" to trigger on all stages.'
                                )}
                            />
                        </StandardFormField>
                    )}

                <StandardFormField>
                    <InputFieldFF
                        input={input}
                        meta={
                            meta as unknown as FieldMetaState<
                                string | undefined
                            >
                        }
                        dataTest="priority-field"
                        inputWidth="120px"
                        label={i18n.t('Priority')}
                        helpText={i18n.t(
                            'Can be 0 or negative. Leave empty if not needed.'
                        )}
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
                    {i18n.t('Configure the program rule condition expression.')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <PaddedContainer>
                        <ExpressionBuilderEntry
                            fieldName="condition"
                            title={i18n.t('Edit condition expression')}
                            editButtonText={i18n.t('Edit condition expression')}
                            setUpButtonText={i18n.t(
                                'Set up condition expression'
                            )}
                            validationResource="programRules/condition/description"
                            clearable={true}
                            programId={programInput?.value?.id}
                            type="default"
                        />
                    </PaddedContainer>
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection name={descriptor.getSection('actions').name}>
                <StandardFormSectionTitle>
                    {i18n.t('Actions')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Configure actions for this program rule.')}
                </StandardFormSectionDescription>
                {!modelId ? (
                    <NoticeBox>
                        {i18n.t(
                            'Program rule must be saved before actions can be added'
                        )}
                    </NoticeBox>
                ) : (
                    <ProgramRuleActionsFormContents />
                )}
            </SectionedFormSection>
        </SectionedFormSections>
    )
}
