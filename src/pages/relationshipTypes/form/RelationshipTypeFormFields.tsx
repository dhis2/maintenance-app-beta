import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, InputFieldFF } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { Field, useField, useForm } from 'react-final-form'
import {
    StandardFormField,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    SectionedFormSections,
    SectionedFormSection,
    NameField,
    CodeField,
    DescriptionField,
    CustomAttributesSection,
} from '../../../components'
import {
    SCHEMA_SECTIONS,
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

    const {
        input: { value: bidirectional },
    } = useField('bidirectional', {
        subscription: { value: true },
    })
    const form = useForm()

    useEffect(() => {
        if (!bidirectional) {
            form.change('toFromName', undefined)
            form.resetFieldState?.('toFromName')
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
                    <NameField schemaSection={schemaSection} />
                </StandardFormField>

                <StandardFormField>
                    <CodeField schemaSection={schemaSection} />
                </StandardFormField>

                <StandardFormField>
                    <DescriptionField />
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
                        dataTest="formfields-fromToName"
                        name="fromToName"
                        label={i18n.t('Name shown for initiating entity')}
                        required
                        inputWidth="400px"
                        validateFields={[]}
                        placeholder={i18n.t('e.g. Mother of')}
                    />
                </StandardFormField>

                <div hidden={!bidirectional}>
                    <StandardFormField>
                        <Field
                            component={InputFieldFF}
                            dataTest="formfields-toFromName"
                            name="toFromName"
                            label={i18n.t('Name shown for receiving entity')}
                            required={bidirectional}
                            inputWidth="400px"
                            validateFields={[]}
                            placeholder={i18n.t('e.g. Child of')}
                        />
                    </StandardFormField>
                </div>
            </SectionedFormSection>

            <SectionedFormSection
                name={descriptor.getSection('relationshipSides').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Relationship sides')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose and configure the objects used on each side of the relationship.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <RelationshipSideFields prefix="from" />
                </StandardFormField>
                <StandardFormField>
                    <RelationshipSideFields prefix="to" />
                </StandardFormField>
            </SectionedFormSection>
            <CustomAttributesSection
                schemaSection={SCHEMA_SECTIONS.relationshipType}
                sectionedLayout
            />
        </SectionedFormSections>
    )
}
