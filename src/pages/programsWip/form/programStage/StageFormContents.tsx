import i18n from '@dhis2/d2-i18n'
import {
    Box,
    Button,
    CheckboxFieldFF,
    Field as UIField,
    InputFieldFF,
    SingleSelectFieldFF,
    composeValidators,
    createMinNumber,
    number,
} from '@dhis2/ui'
import React, { useMemo } from 'react'
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
import { ModelSingleSelectFormField } from '../../../../components/metadataFormControls/ModelSingleSelect'
import { PeriodTypeSelect } from '../../../../components/metadataFormControls/PeriodTypeSelect/PeriodTypeSelect'
import {
    FEATURES,
    SCHEMA_SECTIONS,
    required,
    useFeatureAvailable,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
    useValidator,
    composeAsyncValidators,
    useIsFieldValueUnique,
} from '../../../../lib'
import { ValidationStrategyField } from './fields'
import { EditOrNowStageSectionForm } from './programStageSection/ProgramStageSectionForm'
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
    const showValidationStrategy = useFeatureAvailable(
        FEATURES.validationStrategy
    )

    const checkDuplicateName = useIsFieldValueUnique({
        model: 'programStages',
        field: 'name',
        id: values.id,
        message: i18n.t(
            'A stage with this name already exists. Please choose another name.'
        ),
    })

    const baseNameValidator = useValidator({
        schemaSection: stageSchemaSection,
        property: 'name',
    })

    const nameValidator = useMemo(
        () =>
            composeAsyncValidators<string>([
                baseNameValidator,
                checkDuplicateName,
            ]),
        [baseNameValidator, checkDuplicateName]
    )

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

    const minDaysFromStartValidator = useMemo(
        () => composeValidators(required, number, createMinNumber(0)),
        []
    )

    const standardIntervalValidator = useMemo(() => number, [])

    const autoGenerateEvent = values?.autoGenerateEvent ?? false
    const openAfterEnrollment = values?.openAfterEnrollment ?? false

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
                    <Field
                        name="name"
                        component={InputFieldFF}
                        validate={nameValidator}
                        validateFields={[]}
                        dataTest="formfields-name"
                        required
                        inputWidth="400px"
                        label={i18n.t('Name')}
                    />
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
                {showValidationStrategy && (
                    <StandardFormField>
                        <ValidationStrategyField />
                    </StandardFormField>
                )}
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
                    {i18n.t('Periods and scheduling')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Configure scheduling for events in this program stage.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <Field
                        name="repeatable"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t(
                            'Allow multiple events in this stage (repeatable stage)'
                        )}
                        dataTest="formfields-repeatable"
                    />
                </StandardFormField>
                <StandardFormField>
                    <Field
                        name="standardInterval"
                        component={InputFieldFF}
                        type="number"
                        inputWidth="400px"
                        label={i18n.t('Standard interval days')}
                        dataTest="formfields-standardInterval"
                        validate={standardIntervalValidator}
                        format={(value: unknown) => value?.toString() ?? ''}
                        parse={(value: unknown) => {
                            if (value === undefined || value === '') {
                                return undefined
                            }
                            const num = Number(value)
                            return isNaN(num) ? undefined : num
                        }}
                    />
                </StandardFormField>
                <StandardFormField>
                    <Field
                        name="generatedByEnrollmentDate"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t(
                            'Generate events based on enrollment date'
                        )}
                        dataTest="formfields-generatedByEnrollmentDate"
                    />
                </StandardFormField>
                <StandardFormField>
                    <Field
                        name="autoGenerateEvent"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t('Auto-generate an event in this stage')}
                        dataTest="formfields-autoGenerateEvent"
                    />
                </StandardFormField>
                {autoGenerateEvent && (
                    <StandardFormField>
                        <Field
                            name="openAfterEnrollment"
                            type="checkbox"
                            component={CheckboxFieldFF}
                            label={i18n.t(
                                'Open data entry form after enrollment'
                            )}
                            dataTest="formfields-openAfterEnrollment"
                        />
                    </StandardFormField>
                )}
                {autoGenerateEvent && (
                    <StandardFormField>
                        <Field
                            name="reportDateToUse"
                            component={SingleSelectFieldFF}
                            inputWidth="400px"
                            label={i18n.t('Report date to use')}
                            dataTest="formfields-reportDateToUse"
                            disabled={!openAfterEnrollment}
                            options={[
                                { label: i18n.t('<No value>'), value: '' },
                                {
                                    label: i18n.t('Incident date'),
                                    value: 'incidentDate',
                                },
                                {
                                    label: i18n.t('Enrollment date'),
                                    value: 'enrollmentDate',
                                },
                            ]}
                        />
                    </StandardFormField>
                )}
                <StandardFormField>
                    <Field
                        name="minDaysFromStart"
                        component={InputFieldFF}
                        type="number"
                        inputWidth="400px"
                        min="0"
                        required
                        label={i18n.t('Scheduled days from start (required)')}
                        dataTest="formfields-minDaysFromStart"
                        validate={minDaysFromStartValidator}
                        format={(value: unknown) => value?.toString() ?? '0'}
                        parse={(value: unknown) => {
                            if (value === undefined || value === '') {
                                return 0
                            }
                            const num = Number(value)
                            return isNaN(num) ? 0 : num
                        }}
                        helpText={i18n.t(
                            'Days to add to the enrollment or incident date. 0 means same day, positive numbers schedule that many days after.'
                        )}
                    />
                </StandardFormField>
                <StandardFormField>
                    <Field
                        name="hideDueDate"
                        render={({ input, meta }) => {
                            // Invert the value: hideDueDate=false means show due date (checked)
                            const showDueDate = input.value === false
                            return (
                                <CheckboxFieldFF
                                    input={{
                                        ...input,
                                        checked: showDueDate,
                                        onChange: () => {
                                            // Toggle the inverted value: if currently showing (hideDueDate=false),
                                            // clicking should hide (hideDueDate=true), and vice versa
                                            input.onChange(!showDueDate)
                                        },
                                    }}
                                    meta={meta}
                                    label={i18n.t('Show due date')}
                                    dataTest="formfields-hideDueDate"
                                />
                            )
                        }}
                    />
                </StandardFormField>
                <StandardFormField>
                    <Field
                        name="periodType"
                        render={({ input, meta }) => (
                            <UIField
                                name="periodType"
                                label={i18n.t('Period type')}
                                error={meta.touched && !!meta.error}
                                validationText={
                                    meta.touched ? meta.error : undefined
                                }
                            >
                                <Box width="400px" minWidth="100px">
                                    <PeriodTypeSelect
                                        selected={input.value}
                                        invalid={meta.touched && !!meta.error}
                                        onChange={input.onChange}
                                        noValueOption
                                        dataTest="formfields-periodType"
                                    />
                                </Box>
                            </UIField>
                        )}
                    />
                </StandardFormField>
                <StandardFormField>
                    <ModelSingleSelectFormField
                        name="nextScheduleDate"
                        label={i18n.t('Default next scheduled date')}
                        dataTest="formfields-nextScheduleDate"
                        inputWidth="400px"
                        query={{
                            resource: 'dataElements',
                            params: {
                                fields: ['id', 'displayName', 'valueType'],
                                filter: 'valueType:eq:DATE',
                                paging: false,
                            },
                        }}
                        clearable
                        clearText={i18n.t('<No value>')}
                        format={(value: any) => (value?.id ? value.id : '')}
                        parse={(value: any) =>
                            value && value !== '' ? { id: value } : undefined
                        }
                    />
                </StandardFormField>
                <StandardFormField>
                    <Field
                        name="allowGenerateNextVisit"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t(
                            'On event completion, show a prompt to create a new event'
                        )}
                        dataTest="formfields-allowGenerateNextVisit"
                    />
                </StandardFormField>
                <StandardFormField>
                    <Field
                        name="remindCompleted"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t(
                            'On event completion, ask user to complete program'
                        )}
                        dataTest="formfields-remindCompleted"
                    />
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
