import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import { useQuery } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import React, { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
    FormBase,
    FormBaseProps,
    FormFooterWrapper,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../../../components'
import { DrawerSectionedFormSidebar } from '../../../../components/drawer/DrawerSectionedFormSidebar'
import { LoadingSpinner } from '../../../../components/loading/LoadingSpinner'
import {
    createFormError,
    createJsonPatchOperations,
    DEFAULT_FIELD_FILTERS,
    SchemaName,
    SchemaSection,
    SectionedFormProvider,
    useBoundResourceQueryFn,
    useCreateModel,
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
    'name',
    'description',
] as const

export const stageSchemaSection = {
    name: SchemaName.programStage,
    namePlural: 'programStages',
    title: i18n.t('Stage'),
    titlePlural: i18n.t('Stages'),
    parentSectionKey: 'programsAndTracker',
} satisfies SchemaSection

export type StageFormValues = PickWithFieldFilters<
    ProgramStage,
    typeof fieldFilters
> & {
    program: { id: string }
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

export type StageFormProps = {
    stage?: PartialStageFormValues
    onCancel?: () => void
    onSubmit: OnSubmitWithClose
}

export const StageForm = ({ stage, onSubmit, onCancel }: StageFormProps) => {
    const programId = useParams().id as string

    const initialValues: PartialStageFormValues | undefined = useMemo(() => {
        if (stage) {
            return stage
        }
        return initialStageValue
    }, [stage])

    const valueFormatter = useCallback(
        (values: PartialStageFormValues) => {
            return {
                ...values,
                program: { id: programId },
            }
        },
        [programId]
    )
    const closeOnSubmitRef = React.useRef(false)
    const setCloseOnSubmit = (value: boolean) => {
        closeOnSubmitRef.current = value
    }

    return (
        <FormBase
            initialValues={{ ...initialValues, program: { id: programId } }}
            onSubmit={(values, form, options) =>
                onSubmit(values, form, options, closeOnSubmitRef.current)
            }
            valueFormatter={valueFormatter}
            includeAttributes={false}
            mutators={{ ...arrayMutators }}
        >
            {({ handleSubmit, form }) => {
                return (
                    <SectionedFormProvider formDescriptor={StageFormDescriptor}>
                        <SectionedFormLayout
                            sidebar={
                                <DrawerSectionedFormSidebar
                                    onCancel={onCancel}
                                />
                            }
                        >
                            <form onSubmit={handleSubmit}>
                                <div className={styles.sectionsWrapper}>
                                    <StageFormContents isSubsection />
                                    <FormFooterWrapper>
                                        <ButtonStrip>
                                            <Button
                                                primary
                                                small
                                                type="button"
                                                onClick={() => {
                                                    setCloseOnSubmit(true)
                                                    form.submit()
                                                }}
                                            >
                                                {i18n.t('Save and close')}
                                            </Button>
                                            <Button
                                                primary
                                                small
                                                type="button"
                                                onClick={() => {
                                                    setCloseOnSubmit(false)
                                                    form.submit()
                                                }}
                                            >
                                                {i18n.t('Save ')}
                                            </Button>
                                            <Button
                                                secondary
                                                small
                                                onClick={onCancel}
                                            >
                                                {i18n.t('Cancel')}
                                            </Button>
                                        </ButtonStrip>
                                        <div className={styles.actionsInfo}>
                                            <IconInfo16 />
                                            <p>
                                                {i18n.t(
                                                    'Saving a stage does not save other changes to the program'
                                                )}
                                            </p>
                                        </div>
                                    </FormFooterWrapper>
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
    onCancel,
    onSubmitted,
}: {
    stage: DisplayableModel
    onCancel: () => void
    onSubmitted: (
        values: SubmittedStageFormValues,
        closeOnSubmit: boolean
    ) => void
}) => {
    const handlePatch = usePatchModel(stage.id, stageSchemaSection.namePlural)

    const queryFn = useBoundResourceQueryFn()

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

    const onFormSubmit: OnSubmitWithClose = async (
        values,
        form,
        c,
        closeOnSubmit?: boolean
    ) => {
        stageValues.remove()
        const jsonPatchOperations = createJsonPatchOperations({
            values,
            dirtyFields: form.getState().dirtyFields,
            originalValue: form.getState().initialValues,
        })
        const response = await handlePatch(jsonPatchOperations)
        if (response.error) {
            return createFormError(response.error)
        }

        const updatedName = jsonPatchOperations.find(
            (op) => op.path === '/name' && op.op === 'replace'
        )?.value as string | undefined
        const resolvedDisplayName =
            updatedName || values?.displayName || values.name || ''

        onSubmitted?.(
            {
                ...values,
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
            onCancel={onCancel}
        />
    )
}

export const NewStageForm = ({
    onCancel,
    onSubmitted,
}: {
    onCancel: () => void
    onSubmitted: (
        values: SubmittedStageFormValues,
        closeOnSubmit: boolean
    ) => void
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
            onCancel={onCancel}
        />
    )
}

export const EditOrNewStageForm = ({
    stage,
    onCancel,
    onSubmitted,
}: {
    stage: DisplayableModel | null | undefined
    onCancel: () => void
    onSubmitted: (
        values: SubmittedStageFormValues,
        closeOnSubmit: boolean
    ) => void
}) => {
    if (stage === undefined) {
        return
    }
    if (stage === null) {
        return <NewStageForm onSubmitted={onSubmitted} onCancel={onCancel} />
    }

    return (
        <EditStageForm
            stage={stage}
            onCancel={onCancel}
            onSubmitted={onSubmitted}
        />
    )
}
