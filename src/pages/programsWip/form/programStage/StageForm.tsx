import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import isEqual from 'lodash/isEqual'
import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    FormBase,
    FormBaseProps,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../../../components'
import { DrawerSectionedFormSidebar } from '../../../../components/drawer/DrawerSectionedFormSidebar'
import { Section } from '../../../../components/formCreators/SectionFormList'
import { LoadingSpinner } from '../../../../components/loading/LoadingSpinner'
import { useHandleOnSubmitEditFormDeletions } from '../../../../components/sectionedForm/useHandleOnSubmitEditFormDeletions'
import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    createFormError,
    createJsonPatchOperations,
    DEFAULT_FIELD_FILTERS,
    getAllAttributeValues,
    SchemaName,
    SchemaSection,
    SectionedFormProvider,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useCreateModel,
    useCustomAttributesQuery,
    usePatchModel,
} from '../../../../lib'
import {
    DisplayableModel,
    PickWithFieldFilters,
    ProgramStage,
} from '../../../../types/models'
import styles from './StageForm.module.css'
import { StageFormContents } from './StageFormContents'
import { StageFormDescriptor } from './stageFormDescriptor'
import { initialStageValue } from './stageSchema'

export const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'description',
    'style[color,icon]',
    'enableUserAssignment',
    'featureType',
    'validationStrategy',
    'preGenerateUID',
    'executionDateLabel',
    'dueDateLabel',
    'programStageLabel',
    'eventLabel',
    'programStageSections[id,displayName]',
    'programStageDataElements[id,dataElement[id,displayName,valueType],compulsory,displayInReports,allowFutureDate,skipAnalytics,skipSynchronization,renderType,sortOrder]',
    'dataEntryForm[id,displayName,htmlCode]',
    'repeatable',
    'standardInterval',
    'generatedByEnrollmentDate',
    'autoGenerateEvent',
    'openAfterEnrollment',
    'reportDateToUse',
    'minDaysFromStart',
    'hideDueDate',
    'periodType',
    'nextScheduleDate[id,displayName,valueType]',
    'allowGenerateNextVisit',
    'remindCompleted',
] as const

export const stageSchemaSection = {
    name: SchemaName.programStage,
    namePlural: 'programStages',
    title: i18n.t('Stage'),
    titlePlural: i18n.t('Stages'),
    parentSectionKey: 'programsAndTracker',
} satisfies SchemaSection

export type StageFormValuesFromFilters = PickWithFieldFilters<
    ProgramStage,
    typeof fieldFilters
> & {
    program: { id: string }
}

export type StageFormValues = Omit<
    StageFormValuesFromFilters,
    'programStageSections' | 'dataEntryForm'
> & {
    programStageSections: Section[]
    dataEntryForm: StageFormValuesFromFilters['dataEntryForm'] & {
        deleted?: boolean
    }
}

type PartialStageFormValues = Partial<StageFormValues>
export type SubmittedStageFormValues = PartialStageFormValues & DisplayableModel

type BaseOnSubmit = FormBaseProps<PartialStageFormValues>['onSubmit']

type OnSubmitWithClose = (
    values: Parameters<BaseOnSubmit>[0],
    form: Parameters<BaseOnSubmit>[1],
    options?: Parameters<BaseOnSubmit>[2],
    closeOnSubmit?: boolean
) => ReturnType<BaseOnSubmit>

export type StageFormActions = {
    saveAndClose: () => void
    save: () => void
}

export type StageFormProps = {
    stage?: PartialStageFormValues
    onSubmit: OnSubmitWithClose
    onActionsReady?: (actions: StageFormActions) => void
}

const StageFormActionsHandler = ({
    onActionsReady,
    closeOnSubmitRef,
}: {
    onActionsReady?: (actions: StageFormActions) => void
    closeOnSubmitRef: React.MutableRefObject<boolean>
}) => {
    const form = useForm()

    useEffect(() => {
        onActionsReady?.({
            saveAndClose: () => {
                closeOnSubmitRef.current = true
                form.submit()
            },
            save: () => {
                closeOnSubmitRef.current = false
                form.submit()
            },
        })
    }, [onActionsReady, closeOnSubmitRef, form])

    return null
}

export const StageForm = ({
    stage,
    onSubmit,
    onActionsReady,
}: StageFormProps) => {
    const programId = useParams().id as string
    const customAttributes = useCustomAttributesQuery({
        enabled: true,
    })
    const initialValues: PartialStageFormValues | undefined = useMemo(() => {
        const initialValues = stage ?? {
            ...initialStageValue,
            program: { id: programId },
        }

        const attributeValues = getAllAttributeValues(
            initialValues?.attributeValues ?? [],
            customAttributes.data ?? []
        )
        return { ...initialValues, attributeValues } as PartialStageFormValues
    }, [stage, programId, customAttributes])

    const closeOnSubmitRef = React.useRef(false)
    const [selectedSection, setSelectedSection] = React.useState<
        string | undefined
    >()

    return (
        <FormBase
            initialValuesEqual={isEqual}
            initialValues={initialValues}
            onSubmit={(values, form, options) =>
                onSubmit(values, form, options, closeOnSubmitRef.current)
            }
            includeAttributes={false}
            mutators={{ ...arrayMutators }}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider formDescriptor={StageFormDescriptor}>
                        <StageFormActionsHandler
                            onActionsReady={onActionsReady}
                            closeOnSubmitRef={closeOnSubmitRef}
                        />
                        <SectionedFormLayout
                            sidebar={
                                <DrawerSectionedFormSidebar
                                    selectedSection={selectedSection}
                                />
                            }
                        >
                            <form onSubmit={handleSubmit}>
                                <div className={styles.sectionsWrapper}>
                                    <div>
                                        <StageFormContents
                                            isSubsection
                                            setSelectedSection={
                                                setSelectedSection
                                            }
                                        />
                                    </div>
                                </div>
                            </form>
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    </SectionedFormProvider>
                )
            }}
        </FormBase>
    )
}

export const EditStageForm = ({
    stage,
    onSubmitted,
    onActionsReady,
}: {
    stage: DisplayableModel
    onSubmitted: (
        values: SubmittedStageFormValues,
        closeOnSubmit: boolean
    ) => void
    onActionsReady?: (actions: StageFormActions) => void
}) => {
    const handlePatch = usePatchModel(stage.id, stageSchemaSection.namePlural)

    const queryFn = useBoundResourceQueryFn()
    const dataEngine = useDataEngine()
    const queryClient = useQueryClient()
    const { show: showSuccess } = useAlert(i18n.t('Stage form saved'), {
        success: true,
    })

    const stageValues = useQuery({
        queryFn: queryFn<StageFormValues>,
        queryKey: [
            {
                resource: 'programStages',
                id: stage.id,
                params: {
                    fields: fieldFilters.concat(),
                },
            },
        ],
    })

    const handleDeletions = useHandleOnSubmitEditFormDeletions(
        SECTIONS_MAP.programStage,
        'programStageSections',
        dataEngine,
        queryClient
    )

    const onFormSubmit: OnSubmitWithClose = async (
        values,
        form,
        c,
        closeOnSubmit?: boolean
    ) => {
        const formValues = form.getState().values
        const sections = formValues.programStageSections ?? []
        const dataEntryForm = formValues.dataEntryForm

        const { customFormDeleteResult, error } = await handleDeletions(
            sections,
            dataEntryForm
        )

        if (error) {
            return error
        }
        const nonDeletedProgramStageSections = sections.filter(
            (section) => !section.deleted
        )
        const trimmedValues = {
            ...values,
            programStageSections: nonDeletedProgramStageSections,
            dataEntryForm:
                customFormDeleteResult &&
                customFormDeleteResult?.[0]?.status !== 'rejected'
                    ? null
                    : values.dataEntryForm,
        } as Partial<StageFormValues>

        const jsonPatchOperations = createJsonPatchOperations({
            values: trimmedValues,
            dirtyFields: form.getState().dirtyFields,
            originalValue: form.getState().initialValues,
        })
        const response = await handlePatch(jsonPatchOperations)
        if (response.error) {
            return createFormError(response.error)
        }

        showSuccess({ success: true })
        if (
            nonDeletedProgramStageSections.length !==
            formValues.programStageSections?.length
        ) {
            form.change('programStageSections', nonDeletedProgramStageSections)
        }
        if (formValues.dataEntryForm?.deleted) {
            form.change('dataEntryForm', undefined)
        }

        const updatedName = jsonPatchOperations.find(
            (op) => op.path === '/name' && op.op === 'replace'
        )?.value as string | undefined
        const resolvedDisplayName =
            updatedName || values?.displayName || values.name || ''

        onSubmitted?.(
            {
                ...trimmedValues,
                id: stage.id,
                displayName: resolvedDisplayName,
            },
            closeOnSubmit ?? true
        )
        return undefined
    }

    if (stageValues.isLoading) {
        return <LoadingSpinner />
    }

    return (
        <StageForm
            stage={stageValues.data}
            onSubmit={onFormSubmit}
            onActionsReady={onActionsReady}
        />
    )
}

export const NewStageForm = ({
    onSubmitted,
    onActionsReady,
}: {
    onSubmitted: (
        values: SubmittedStageFormValues,
        closeOnSubmit: boolean
    ) => void
    onActionsReady?: (actions: StageFormActions) => void
}) => {
    const handleCreate = useCreateModel(stageSchemaSection.namePlural)
    const onFormSubmit: OnSubmitWithClose = async (
        values,
        b,
        c,
        closeOnSubmit?: boolean
    ) => {
        const res = await handleCreate(values)
        if (res.error) {
            return createFormError(res.error)
        }
        const newId = (res.data as { response: { uid: string } }).response.uid
        onSubmitted?.(
            {
                ...values,
                id: newId,
                displayName: values?.displayName || values.name || '',
            },
            closeOnSubmit ?? true
        )
        return undefined
    }

    return (
        <StageForm
            stage={undefined}
            onSubmit={onFormSubmit}
            onActionsReady={onActionsReady}
        />
    )
}

export const EditOrNewStageForm = ({
    stage,
    onSubmitted,
    onActionsReady,
}: {
    stage: DisplayableModel | null | undefined
    onSubmitted: (
        values: SubmittedStageFormValues,
        closeOnSubmit: boolean
    ) => void
    onActionsReady?: (actions: StageFormActions) => void
}) => {
    if (stage === undefined) {
        return null
    }

    if (stage === null) {
        return (
            <NewStageForm
                onSubmitted={onSubmitted}
                onActionsReady={onActionsReady}
            />
        )
    }

    return (
        <EditStageForm
            stage={stage}
            onSubmitted={onSubmitted}
            onActionsReady={onActionsReady}
        />
    )
}
