import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { useFormState } from 'react-final-form'
import {
    CustomAttributesSection,
    DrawerPortal,
    NameField,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import {
    SCHEMA_SECTIONS,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../../lib'
import { EditOrNowStageSectionForm } from './programStageSection/ProgramStageSectionForm'
import { StageDataFormContents } from './StageDataFormContents'
import { stageSchemaSection } from './StageForm'
import { StageFormDescriptor } from './stageFormDescriptor'

export const StageFormContents = ({
    isSubsection,
    setSelectedSection,
}: {
    isSubsection: boolean
    setSelectedSection: (name: string) => void
}) => {
    const [sectionsFormOpen, setSectionsFormOpen] = React.useState(false)
    const { values } = useFormState({ subscription: { values: true } })
    const descriptor = useSectionedFormContext<typeof StageFormDescriptor>()
    useSyncSelectedSectionWithScroll(setSelectedSection)

    return (
        <SectionedFormSections>
            <SectionedFormSection
                name={descriptor.getSection('stageSetup').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Configure the basic information for this program stage.'
                    )}
                </StandardFormSectionDescription>
                <NameField schemaSection={stageSchemaSection} />
                <div>FORM VALUES: {values && JSON.stringify(values)}</div>
                <div style={{ minHeight: 600 }} />
            </SectionedFormSection>
            <SectionedFormSection
                name={descriptor.getSection('stageCreationAndScheduling').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Event Repetition')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Define the frequency of events within this stage.'
                    )}
                </StandardFormSectionDescription>
                <div style={{ minHeight: 600 }} />
            </SectionedFormSection>
            <SectionedFormSection
                name={descriptor.getSection('stageData').name}
            >
                <StageDataFormContents
                    name={descriptor.getSection('stageData').name}
                />
            </SectionedFormSection>
            <SectionedFormSection
                name={descriptor.getSection('stageForm').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Program stage form')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Configure the form for data collection for events in this program stage.'
                    )}
                </StandardFormSectionDescription>
                <DrawerPortal
                    isOpen={sectionsFormOpen}
                    level={isSubsection ? 'secondary' : 'primary'}
                    onClose={() => setSectionsFormOpen(false)}
                >
                    <EditOrNowStageSectionForm
                        stageId={values.id}
                        onCancel={() => setSectionsFormOpen(false)}
                        onSubmitted={() => {}}
                        section={null}
                        sectionsLength={
                            values.programStageSections?.length || 0
                        }
                    />
                </DrawerPortal>
                <Button
                    disabled={values.id === undefined}
                    onClick={() => {
                        setSectionsFormOpen(true)
                    }}
                >
                    Create a section
                </Button>
                <div style={{ minHeight: 600 }} />
            </SectionedFormSection>
            <CustomAttributesSection
                schemaSection={SCHEMA_SECTIONS.programStage}
                sectionedLayout
            />
        </SectionedFormSections>
    )
}
