import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, InputFieldFF } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { Field, useFormState } from 'react-final-form'
import {
    ColorAndIconField,
    CustomAttributesSection,
    DescriptionField,
    FeatureTypeField,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import {
    composeAsyncValidators,
    FEATURES,
    SCHEMA_SECTIONS,
    useFeatureAvailable,
    useIsFieldValueUnique,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
    useValidator,
} from '../../../../lib'
import { ValidationStrategyField } from './fields'
import { StageCreationAndSchedulingFormContents } from './StageCreationAndSchedulingFormContents'
import { StageDataFormContents } from './StageDataFormContents'
import { stageSchemaSection } from './StageForm'
import { StageFormDescriptor } from './stageFormDescriptor'
import { StageFormFormContents } from './StageFormFormContents'

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

    return (
        <div style={{ padding: 'var(--spacers-dp16) 0 0 0' }}>
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
                        {i18n.t(
                            'Customise the wording of labels for this stage.'
                        )}
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
                <StageCreationAndSchedulingFormContents
                    name={
                        descriptor.getSection('stageCreationAndScheduling').name
                    }
                    sectionLabel={
                        descriptor.getSection('stageCreationAndScheduling')
                            .label
                    }
                />
                <StageDataFormContents
                    name={descriptor.getSection('stageData').name}
                    sectionLabel={descriptor.getSection('stageData').label}
                />
                <StageFormFormContents
                    isSubsection={isSubsection}
                    name={descriptor.getSection('stageForm').name}
                    sectionLabel={i18n.t('Program stage form')}
                />
                <CustomAttributesSection
                    schemaSection={SCHEMA_SECTIONS.programStage}
                    sectionedLayout
                />
            </SectionedFormSections>
        </div>
    )
}
