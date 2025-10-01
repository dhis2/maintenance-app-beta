import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    StandardFormField,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    SectionedFormSections,
    SectionedFormSection,
    CustomAttributesSection,
    ColorAndIconField,
    DescriptionField,
    NameField,
    ShortNameField,
} from '../../../components'
import {
    SECTIONS_MAP,
    useSchemaSectionHandleOrThrow,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import {
    AttributesTransferField,
    AttributesConfigurationField,
    AllowAuditLogField,
    MinAttributesRequiredField,
    MaxTeiCountField,
} from '../fields'
import { TrackedEntityTypeFormDescriptor } from './formDescriptor'

export function TrackedEntityTypeFormFields() {
    const schemaSection = useSchemaSectionHandleOrThrow()
    const descriptor =
        useSectionedFormContext<typeof TrackedEntityTypeFormDescriptor>()
    useSyncSelectedSectionWithScroll()

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
                        'Set up the basic information for this tracked entity type.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <NameField schemaSection={schemaSection} />
                </StandardFormField>

                <StandardFormField>
                    <ShortNameField schemaSection={schemaSection} />
                </StandardFormField>

                <StandardFormField>
                    <ColorAndIconField
                        helpText={i18n.t(
                            'A color and icon are helpful for identifying tracked entity types in information-dense screens.'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <DescriptionField
                        helpText={i18n.t(
                            'Explain the purpose of this tracked entity type.'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <AllowAuditLogField />
                </StandardFormField>

                <StandardFormField>
                    <MinAttributesRequiredField />
                </StandardFormField>

                <StandardFormField>
                    <MaxTeiCountField />
                </StandardFormField>
            </SectionedFormSection>

            <SectionedFormSection
                name={descriptor.getSection('trackedEntityAttributes').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Tracked entity attributes')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose and configure what data can be collected for this tracked entity type'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <AttributesTransferField />
                </StandardFormField>

                <StandardFormField>
                    <AttributesConfigurationField />
                </StandardFormField>

                <CustomAttributesSection
                    schemaSection={SECTIONS_MAP.trackedEntityType}
                    sectionedLayout
                />
            </SectionedFormSection>
        </SectionedFormSections>
    )
}
