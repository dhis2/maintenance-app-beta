import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import { useQuery } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import React, { useMemo } from 'react'
import {
    FormBase,
    FormBaseProps,
    FormFooterWrapper,
    SectionedFormErrorNotice,
} from '../../../../../components'
import { DefaultFormErrorNotice } from '../../../../../components/form/DefaultFormErrorNotice'
import { LoadingSpinner } from '../../../../../components/loading/LoadingSpinner'
import {
    createFormError,
    createJsonPatchOperations,
    DEFAULT_FIELD_FILTERS,
    SchemaName,
    SchemaSection,
    useBoundResourceQueryFn,
    useCreateModel,
    usePatchModel,
} from '../../../../../lib'
import {
    DisplayableModel,
    PickWithFieldFilters,
    Section,
} from '../../../../../types/models'
import { ProgramStageSectionFormContents } from './ProgramStageSectionFormContents'
import styles from './StageSectionFormContents.module.css'
import { initialStageSectionValues } from './stageSectionFormSchema'

export const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'description',
    'renderType[MOBILE[type],DESKTOP[type]]',
    'dataElements[id,displayName]',
    'programStage[id]',
] as const

export const stageSectionSchemaSection = {
    name: SchemaName.programStageSection,
    namePlural: 'programStageSections',
    title: i18n.t('Stage section'),
    titlePlural: i18n.t('Stage sections'),
    parentSectionKey: 'programsAndTracker',
} satisfies SchemaSection

type OnFormSubmit = FormBaseProps<PartialSectionFormValues>['onSubmit']
export type SectionFormValues = PickWithFieldFilters<
    Section,
    typeof fieldFilters
> & {
    program: { id: string }
}

type PartialSectionFormValues = Partial<SectionFormValues>
type SubmittedSectionFormValues = PartialSectionFormValues & DisplayableModel

export type StageSectionFormProps = {
    stageSection?: PartialSectionFormValues
    onCancel?: () => void
    stageId?: string
    sortOrder?: number
} & Pick<FormBaseProps<PartialSectionFormValues>, 'onSubmit'>

export const StageSectionForm = ({
    stageSection,
    onSubmit,
    onCancel,
    stageId,
    sortOrder,
}: StageSectionFormProps) => {
    const initialValues: PartialSectionFormValues | undefined = useMemo(() => {
        if (stageSection) {
            return stageSection
        }
        return {
            ...initialStageSectionValues,
            sortOrder,
            programStage: { id: stageId },
        }
    }, [stageSection, sortOrder, stageId])

    return (
        <FormBase
            initialValues={initialValues}
            onSubmit={onSubmit}
            includeAttributes={false}
            mutators={{ ...arrayMutators }}
        >
            {({ submitting, form }) => {
                return (
                    <div>
                        <div className={styles.sectionsWrapper}>
                            <div>
                                <ProgramStageSectionFormContents />
                                <SectionedFormErrorNotice />
                            </div>
                            <FormFooterWrapper>
                                <ButtonStrip>
                                    <Button
                                        primary
                                        small
                                        disabled={submitting}
                                        type="button"
                                        onClick={() => form.submit()}
                                        loading={submitting}
                                        dataTest="form-submit-button"
                                    >
                                        {i18n.t('Save section')}
                                    </Button>
                                    <Button
                                        secondary
                                        small
                                        disabled={submitting}
                                        onClick={onCancel}
                                        dataTest="form-cancel-link"
                                    >
                                        {i18n.t('Cancel')}
                                    </Button>
                                </ButtonStrip>
                                <div className={styles.actionsInfo}>
                                    <IconInfo16 />
                                    <p>
                                        {i18n.t(
                                            'Saving a section does not save other changes to the program stage'
                                        )}
                                    </p>
                                </div>
                            </FormFooterWrapper>
                        </div>
                        <div className={styles.errorNoticeWrapper}>
                            <DefaultFormErrorNotice />
                        </div>
                    </div>
                )
            }}
        </FormBase>
    )
}

export const EditStageSectionForm = ({
    section,
    onCancel,
    onSubmitted,
    stageId,
}: {
    section: DisplayableModel
    onCancel: () => void
    onSubmitted: (values: SubmittedSectionFormValues) => void
    stageId?: string
}) => {
    const handlePatch = usePatchModel(
        section.id,
        stageSectionSchemaSection.namePlural
    )
    const { show: showSuccess } = useAlert(i18n.t('Stage section form saved'), {
        success: true,
    })

    const onFormSubmit: OnFormSubmit = async (values, form) => {
        const jsonPatchOperations = createJsonPatchOperations({
            values,
            dirtyFields: form.getState().dirtyFields,
            originalValue: form.getState().initialValues,
        })
        const response = await handlePatch(jsonPatchOperations)
        if (response.error) {
            return createFormError(response.error)
        }
        showSuccess({ success: true })

        const updatedName = jsonPatchOperations.find(
            (op) => op.path === '/name' && op.op === 'replace'
        )?.value as string | undefined
        const resolvedDisplayName =
            updatedName || values?.displayName || values.name || ''

        onSubmitted?.({
            ...values,
            id: section.id,
            displayName: resolvedDisplayName,
        })
        return undefined
    }

    const queryFn = useBoundResourceQueryFn()
    const sectionValues = useQuery({
        queryFn: queryFn<SectionFormValues>,
        queryKey: [
            {
                resource: 'programStageSections',
                id: section.id,
                params: {
                    fields: fieldFilters.concat(),
                },
            },
        ],
    })

    if (sectionValues.isLoading) {
        return <LoadingSpinner />
    }

    return (
        <StageSectionForm
            stageSection={sectionValues.data}
            onSubmit={onFormSubmit}
            onCancel={onCancel}
            stageId={stageId}
        />
    )
}

export const NewStageSectionForm = ({
    onCancel,
    onSubmitted,
    stageId,
    sortOrder,
}: {
    onCancel: () => void
    onSubmitted: (values: SubmittedSectionFormValues) => void
    stageId?: string
    sortOrder: number
}) => {
    const handleCreate = useCreateModel(stageSectionSchemaSection.namePlural)
    const { show: showSuccess } = useAlert(i18n.t('Stage section form saved'), {
        success: true,
    })

    const onFormSubmit: OnFormSubmit = async (values) => {
        const res = await handleCreate(values)
        if (res.error) {
            return createFormError(res.error)
        }
        showSuccess({ success: true })
        const newId = (res.data as { response: { uid: string } }).response.uid

        onSubmitted?.({
            ...values,
            id: newId,
            displayName: values?.displayName || values.name || '',
        })
        return undefined
    }

    return (
        <StageSectionForm
            stageId={stageId}
            stageSection={undefined}
            onSubmit={onFormSubmit}
            onCancel={onCancel}
            sortOrder={sortOrder}
        />
    )
}

export const EditOrNewStageSectionForm = ({
    section,
    stageId,
    onCancel,
    onSubmitted,
    sectionsLength,
}: {
    section: DisplayableModel | null | undefined
    stageId?: string
    onCancel: () => void
    onSubmitted: (values: SubmittedSectionFormValues) => void
    sectionsLength: number
}) => {
    if (section === undefined) {
        return
    }
    if (section === null) {
        return (
            <NewStageSectionForm
                onSubmitted={onSubmitted}
                onCancel={onCancel}
                stageId={stageId}
                sortOrder={sectionsLength}
            />
        )
    }

    return (
        <EditStageSectionForm
            section={section}
            onCancel={onCancel}
            onSubmitted={onSubmitted}
            stageId={stageId}
        />
    )
}
