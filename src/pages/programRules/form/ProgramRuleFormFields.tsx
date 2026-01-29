import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField, useFormState } from 'react-final-form'
import type { FieldMetaState } from 'react-final-form'
import {
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { DescriptionField, NameField } from '../../../components/form/fields'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import {
    useSchemaSectionHandleOrThrow,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import { ProgramRuleFormDescriptor } from './formDescriptor'

export const ProgramRuleFormFields = () => {
    const schemaSection = useSchemaSectionHandleOrThrow()
    const descriptor =
        useSectionedFormContext<typeof ProgramRuleFormDescriptor>()
    useSyncSelectedSectionWithScroll()
    const { values } = useFormState({ subscription: { values: true } })

    const { input, meta } = useField('priority', {
        parse: (value?: string) =>
            value === undefined || value === '' ? 0 : parseFloat(value),
        type: 'number',
        format: (value) => value?.toString(),
    })

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
                                fields: ['id', 'displayName'],
                                paging: false,
                            },
                        }}
                        disabled={isEdit}
                    />
                </StandardFormField>

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
        </SectionedFormSections>
    )
}
