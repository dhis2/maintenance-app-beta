import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, InputFieldFF } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { Field, useFormState, useForm } from 'react-final-form'
import {
    StandardFormField,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    SectionedFormSections,
    SectionedFormSection,
    NameField,
    CodeField,
    DescriptionField,
} from '../../../components'
import {
    useSchemaSectionHandleOrThrow,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import { RelationshipTypeFormDescriptor } from './formDescriptor'
import { RelationshipSideFields } from './RelationshipSidesFields'

export function RelationshipTypeFormFields() {
    const schemaSection = useSchemaSectionHandleOrThrow()
    const descriptor =
        useSectionedFormContext<typeof RelationshipTypeFormDescriptor>()
    useSyncSelectedSectionWithScroll()

    const formValues = useFormState<{ bidirectional?: boolean }>({
        subscription: { values: true },
    }).values
    const bidirectional = formValues.bidirectional
    const form = useForm()

    useEffect(() => {
        if (!bidirectional && form) {
            const toFromNameValue = form.getFieldState('toFromName')?.value
            if (toFromNameValue) {
                form.change('toFromName', undefined)
            }
        }
    }, [bidirectional, form])

    return (
        <SectionedFormSections>
            <SectionedFormSection name={descriptor.getSection('basic').name}>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this relationship type.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <NameField
                        schemaSection={schemaSection}
                        helpText={i18n.t(
                            'Will be shown everywhere a user sees a relationship type.'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <CodeField schemaSection={schemaSection} />
                </StandardFormField>

                <StandardFormField>
                    <DescriptionField
                        helpText={i18n.t(
                            'Provide a helpful description of what this relationship is used for.'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <Field
                        component={CheckboxFieldFF}
                        dataTest="formfields-bidirectional"
                        name="bidirectional"
                        label={i18n.t(
                            'Bidirectional: relationship can be created from both sides',
                            { nsSeparator: '~:~' }
                        )}
                        type="checkbox"
                        validateFields={[]}
                    />
                </StandardFormField>

                <StandardFormField>
                    <Field
                        component={InputFieldFF}
                        name="fromToName"
                        label={i18n.t(
                            'Relationship name seen from initiating entity'
                        )}
                        required
                        inputWidth="400px"
                        validateFields={[]}
                    />
                </StandardFormField>

                {bidirectional && (
                    <StandardFormField>
                        <Field
                            component={InputFieldFF}
                            name="toFromName"
                            label={i18n.t(
                                'Relationship name seen from receiving entity'
                            )}
                            required
                            inputWidth="400px"
                            validateFields={[]}
                        />
                    </StandardFormField>
                )}
            </SectionedFormSection>

            <SectionedFormSection
                name={descriptor.getSection('relationshipSides').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Relationship sides')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose and configure which objects can be used as the initiating and receiving sides of the relationship.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <RelationshipSideFields prefix="from" />
                </StandardFormField>
                <StandardFormField>
                    <RelationshipSideFields prefix="to" />
                </StandardFormField>
            </SectionedFormSection>
        </SectionedFormSections>
    )
}
