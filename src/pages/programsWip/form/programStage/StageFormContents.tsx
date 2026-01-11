import i18n from '@dhis2/d2-i18n'
import { Button, CheckboxFieldFF, InputFieldFF } from '@dhis2/ui'
import React, { useCallback } from 'react'
import { Field, useFormState } from 'react-final-form'
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
    SCHEMA_SECTIONS,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
    useValidator,
} from '../../../../lib'
import { ProgramStageListItem } from '../ProgramStagesFormContents'
import { ValidationStrategyField } from './fields'
import { EditOrNowStageSectionForm } from './programStageSection/ProgramStageSectionForm'
import { stageSchemaSection } from './StageForm'
import { StageFormDescriptor } from './stageFormDescriptor'

export const StageFormContents = ({
    isSubsection,
    setSelectedSection,
    existingStages,
}: {
    isSubsection: boolean
    setSelectedSection: (name: string) => void
    existingStages?: ProgramStageListItem[]
}) => {
    const [sectionsFormOpen, setSectionsFormOpen] = React.useState(false)
    const { values } = useFormState({ subscription: { values: true } })
    const descriptor = useSectionedFormContext<typeof StageFormDescriptor>()
    useSyncSelectedSectionWithScroll(setSelectedSection)

    const nameValidator = useValidator({
        schemaSection: stageSchemaSection,
        property: 'name',
    })
    const executionDateLabelValidator = useValidator({
        schemaSection: stageSchemaSection,
        property: 'executionDateLabel',
    })
    const dueDateLabelValidator = useValidator({
        schemaSection: stageSchemaSection,
        property: 'dueDateLabel',
    })
    const programStageLabelValidator = useValidator({
        schemaSection: stageSchemaSection,
        property: 'programStageLabel',
    })
    const eventLabelValidator = useValidator({
        schemaSection: stageSchemaSection,
        property: 'eventLabel',
    })

    const checkDuplicateName = useCallback(
        (value: string | undefined) => {
            if (!existingStages || !value) {
                return undefined
            }

            const isDuplicate = existingStages.some(
                (stage) =>
                    stage.id !== values.id &&
                    stage.displayName.toLowerCase() === value.toLowerCase()
            )

            return isDuplicate
                ? i18n.t(
                      'A stage with this name already exists in this program'
                  )
                : undefined
        },
        [existingStages, values.id]
    )

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
                    <Field name="name" validate={nameValidator}>
                        {({ input, meta }) => {
                            const duplicateWarning = checkDuplicateName(
                                input.value
                            )
                            return (
                                <InputFieldFF
                                    input={input}
                                    meta={meta}
                                    validateFields={[]}
                                    dataTest="formfields-name"
                                    required
                                    inputWidth="400px"
                                    label={i18n.t('Name')}
                                    validationText={duplicateWarning}
                                    warning={!!duplicateWarning}
                                />
                            )
                        }}
                    </Field>
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
                    <Field
                        name="enableUserAssignment"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t('Allow user assignment of events')}
                        dataTest="formfields-enableUserAssignment"
                    />
                </StandardFormField>
                <StandardFormField>
                    <FeatureTypeField />
                </StandardFormField>
                <StandardFormField>
                    <ValidationStrategyField />
                </StandardFormField>
                <StandardFormField>
                    <Field
                        name="preGenerateUID"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t('Pre-generate event UID')}
                        dataTest="formfields-preGenerateUID"
                    />
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
                    <Field
                        component={InputFieldFF}
                        name="executionDateLabel"
                        inputWidth="400px"
                        label={i18n.t('Custom label for report date')}
                        dataTest="formfields-executionDateLabel"
                        validate={executionDateLabelValidator}
                    />
                </StandardFormField>
                <StandardFormField>
                    <Field
                        component={InputFieldFF}
                        name="dueDateLabel"
                        inputWidth="400px"
                        label={i18n.t('Custom label for due date')}
                        dataTest="formfields-dueDateLabel"
                        validate={dueDateLabelValidator}
                    />
                </StandardFormField>
                <StandardFormField>
                    <Field
                        component={InputFieldFF}
                        name="programStageLabel"
                        inputWidth="400px"
                        label={i18n.t('Custom label for program stage')}
                        dataTest="formfields-programStageLabel"
                        validate={programStageLabelValidator}
                    />
                </StandardFormField>
                <StandardFormField>
                    <Field
                        component={InputFieldFF}
                        name="eventLabel"
                        inputWidth="400px"
                        label={i18n.t('Custom label for event')}
                        dataTest="formfields-eventLabel"
                        validate={eventLabelValidator}
                    />
                </StandardFormField>
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
