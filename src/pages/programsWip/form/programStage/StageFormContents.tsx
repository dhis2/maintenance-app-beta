import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { useFormState } from 'react-final-form'
import {
    ColorAndIconField,
    DescriptionField,
    CustomAttributesSection,
    DrawerPortal,
    FeatureTypeField,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import {
    FEATURES,
    SCHEMA_SECTIONS,
    useFeatureAvailable,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../../lib'
import {
    ValidationStrategyField,
    StageNameField,
    EnableUserAssignmentField,
    PreGenerateUidField,
    RepeatableField,
    GeneratedByEnrollmentDateField,
    AutoGenerateEventField,
    OpenAfterEnrollmentField,
    HideDueDateField,
    AllowGenerateNextVisitField,
    RemindCompletedField,
    ExecutionDateLabelField,
    DueDateLabelField,
    ProgramStageLabelField,
    EventLabelField,
    StandardIntervalField,
    MinDaysFromStartField,
    ReportDateToUseField,
    NextScheduleDateField,
    PeriodTypeField,
} from './fields'
import { EditOrNowStageSectionForm } from './programStageSection/ProgramStageSectionForm'
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
    const showValidationStrategy = useFeatureAvailable(
        FEATURES.validationStrategy
    )

    const autoGenerateEvent = values?.autoGenerateEvent ?? false

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
                <StandardFormField>
                    <StageNameField />
                </StandardFormField>
                <StandardFormField>
                    <DescriptionField />
                </StandardFormField>
                <StandardFormField>
                    <ColorAndIconField />
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection
                name={descriptor.getSection('stageConfiguration').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Configuration options')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up more advanced options for this program stage.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <EnableUserAssignmentField />
                </StandardFormField>
                <StandardFormField>
                    <FeatureTypeField />
                </StandardFormField>
                {showValidationStrategy && (
                    <StandardFormField>
                        <ValidationStrategyField />
                    </StandardFormField>
                )}
                <StandardFormField>
                    <PreGenerateUidField />
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection
                name={descriptor.getSection('stageTerminology').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Custom terminology')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Customise the wording of labels for this stage.')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <ExecutionDateLabelField />
                </StandardFormField>
                <StandardFormField>
                    <DueDateLabelField />
                </StandardFormField>
                <StandardFormField>
                    <ProgramStageLabelField />
                </StandardFormField>
                <StandardFormField>
                    <EventLabelField />
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection
                name={descriptor.getSection('stageCreationAndScheduling').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Event repetition')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Define the frequency of events within this stage.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <RepeatableField />
                </StandardFormField>
                <StandardFormField>
                    <StandardIntervalField />
                </StandardFormField>

                <StandardFormSectionTitle>
                    {i18n.t('Event scheduling')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Configure how and when events in this stage are scheduled.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <GeneratedByEnrollmentDateField />
                </StandardFormField>
                <StandardFormField>
                    <AutoGenerateEventField />
                </StandardFormField>
                {autoGenerateEvent && (
                    <StandardFormField>
                        <OpenAfterEnrollmentField />
                    </StandardFormField>
                )}
                {autoGenerateEvent && (
                    <StandardFormField>
                        <ReportDateToUseField />
                    </StandardFormField>
                )}
                <StandardFormField>
                    <MinDaysFromStartField />
                </StandardFormField>
                <StandardFormField>
                    <HideDueDateField />
                </StandardFormField>
                <StandardFormField>
                    <PeriodTypeField />
                </StandardFormField>
                <StandardFormField>
                    <NextScheduleDateField />
                </StandardFormField>

                <StandardFormSectionTitle>
                    {i18n.t('Completion options')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Decide what should happen after a user completes this event.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <AllowGenerateNextVisitField />
                </StandardFormField>
                <StandardFormField>
                    <RemindCompletedField />
                </StandardFormField>
            </SectionedFormSection>
            <SectionedFormSection
                name={descriptor.getSection('stageData').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Program Stage: Data', { nsSeparator: '~:~' })}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose the information to collect in this program stage. '
                    )}
                </StandardFormSectionDescription>
                <div style={{ minHeight: 600 }} />
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
