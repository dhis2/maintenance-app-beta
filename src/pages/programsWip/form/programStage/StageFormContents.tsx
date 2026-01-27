import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, CheckboxFieldFF, InputFieldFF } from '@dhis2/ui'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Field, useFormState } from 'react-final-form'
import {
    ColorAndIconField,
    DescriptionField,
    CustomAttributesSection,
    FeatureTypeField,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import { CustomFormDataPayload } from '../../../../components/customForm/CustomFormEdit'
import { CustomFormEditEntry } from '../../../../components/customForm/CustomFormEditEntry'
import { useProgramsStageSectionCustomFormElements } from '../../../../components/customForm/useGetCustomFormElements'
import { SectionFormSectionsList } from '../../../../components/formCreators/SectionFormList'
import {
    FormType,
    TabbedFormTypePicker,
} from '../../../../components/formCreators/TabbedFormTypePicker'
import {
    FEATURES,
    SCHEMA_SECTIONS,
    SchemaName,
    scrollToSection,
    useFeatureAvailable,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
    useValidator,
    composeAsyncValidators,
    useIsFieldValueUnique,
} from '../../../../lib'
import styles from '../EnrollmentFormFormContents.module.css'
import { ValidationStrategyField } from './fields'
import { EditOrNewStageSectionForm } from './programStageSection/ProgramStageSectionForm'
import { stageSchemaSection } from './StageForm'
import { StageFormDescriptor } from './stageFormDescriptor'

export const StageFormContents = ({
    isSubsection,
    setSelectedSection,
}: {
    isSubsection: boolean
    setSelectedSection: (name: string) => void
}) => {
    const { values } = useFormState({ subscription: { values: true } })
    const descriptor = useSectionedFormContext<typeof StageFormDescriptor>()
    useSyncSelectedSectionWithScroll(setSelectedSection)
    const showValidationStrategy = useFeatureAvailable(
        FEATURES.validationStrategy
    )
    const [selectedFormType, setSelectedFormType] = useState<FormType>(
        FormType.DEFAULT
    )

    useEffect(() => {
        if (values.dataEntryForm) {
            setSelectedFormType(FormType.CUSTOM)
        } else if (values.programStageSections.length > 0) {
            setSelectedFormType(FormType.SECTION)
        }
    }, [values.dataEntryForm, values.programStageSections])

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

    const dataEngine = useDataEngine()

    const { loading, elementTypes, refetch } =
        useProgramsStageSectionCustomFormElements(values.id)
    const createProgramStageCustomForm = useCallback(
        async (
            data: CustomFormDataPayload,
            onSuccess: (data: CustomFormDataPayload) => void,
            onError: (e: Error) => void
        ) => {
            try {
                const response = await dataEngine.mutate(
                    {
                        resource: `dataEntryForms`,
                        type: 'create',
                        data: data,
                    },
                    {
                        onError,
                    }
                )
                await dataEngine.mutate(
                    {
                        resource: `programStages`,
                        id: values.id as string,
                        type: 'json-patch',
                        data: [
                            {
                                op: 'replace',
                                path: '/dataEntryForm',
                                value: { id: data.id },
                            },
                        ],
                    },
                    {
                        onComplete: () => {
                            // use the data we passed if form was saved and associated to program
                            onSuccess(data)
                        },
                    }
                )
                return { data: response }
            } catch (error) {
                console.error(error)
            }
        },
        [dataEngine, values.id]
    )

    const updateProgramStageCustomForm = useCallback(
        async (
            data: CustomFormDataPayload,
            onSuccess: (data: CustomFormDataPayload) => void,
            onError: (e: Error) => void
        ) => {
            try {
                const response = await dataEngine.mutate(
                    {
                        resource: `dataEntryForms`,
                        id: data.id,
                        type: 'json-patch',
                        data: [
                            {
                                op: 'replace',
                                path: '/htmlCode',
                                value: data.htmlCode,
                            },
                        ],
                    },
                    {
                        onComplete: () => {
                            // the response from this post is empty, so we use the data we passed if it was successful
                            onSuccess(data)
                        },
                        onError,
                    }
                )
                return { data: response }
            } catch (error) {
                console.error(error)
            }
        },
        [dataEngine]
    )

    const updateOrCreateCustomForm = (
        data: CustomFormDataPayload,
        onSuccess: (data: CustomFormDataPayload) => void,
        onError: (e: Error) => void,
        existingFormId: string | undefined
    ) =>
        existingFormId
            ? updateProgramStageCustomForm(data, onSuccess, onError)
            : createProgramStageCustomForm(data, onSuccess, onError)

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
                <div style={{ minHeight: 800 }} />
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
                <TabbedFormTypePicker
                    sectionsLength={values.programStageSections?.length}
                    hasDataEntryForm={!!values.dataEntryForm}
                    hasDataToDisplay={
                        values.programStageDataElements?.length > 0
                    }
                    onFormTypeChange={setSelectedFormType}
                    selectedFormType={selectedFormType}
                    modelId={values.id}
                >
                    {selectedFormType === FormType.DEFAULT && (
                        <div className={styles.basicFormDetails}>
                            <StandardFormSectionTitle>
                                {i18n.t('Basic form')}
                            </StandardFormSectionTitle>
                            <div className={styles.basicFormDescription}>
                                {i18n.t(
                                    'This form displays an auto-generated list of the data elements defined for this program stage.'
                                )}
                            </div>
                            <div>
                                <Button
                                    secondary
                                    small
                                    onClick={() => {
                                        scrollToSection('stageData')
                                    }}
                                >
                                    {i18n.t(
                                        'Edit or rearrange the data elements'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                    {selectedFormType === FormType.SECTION && (
                        <SectionFormSectionsList
                            sectionsFieldName={'programStageSections'}
                            SectionFormComponent={EditOrNewStageSectionForm}
                            schemaName={SchemaName.programStageSection}
                            level={isSubsection ? 'secondary' : 'primary'}
                            otherProps={{
                                sectionsLength:
                                    values.programStageSections?.length,
                                stageId: values.id,
                            }}
                        />
                    )}
                    {selectedFormType === FormType.CUSTOM && (
                        <CustomFormEditEntry
                            level={isSubsection ? 'secondary' : 'primary'}
                            loading={loading}
                            refetch={refetch}
                            elementTypes={elementTypes}
                            updateCustomForm={updateOrCreateCustomForm}
                            customFormTarget="program stage"
                        />
                    )}
                </TabbedFormTypePicker>
            </SectionedFormSection>
            <CustomAttributesSection
                schemaSection={SCHEMA_SECTIONS.programStage}
                sectionedLayout
            />
        </SectionedFormSections>
    )
}
