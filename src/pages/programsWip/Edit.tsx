import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import { omit } from 'lodash'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    DrawerRoot,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import { Section } from '../../components/formCreators/SectionFormList'
import { useHandleOnSubmitEditFormDeletions } from '../../components/sectionedForm/useHandleOnSubmitEditFormDeletions'
import {
    createFormError,
    DEFAULT_FIELD_FILTERS,
    SectionedFormProvider,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useOnSubmitEdit,
    createJsonPatchOperations,
    usePatchModel,
    parseErrorResponse,
} from '../../lib'
import { EnhancedOnSubmit } from '../../lib/form/useOnSubmit'
import { PickWithFieldFilters, Program } from '../../types/generated'
import { validate } from './form'
import { ProgramFormDescriptor } from './form/formDescriptor'
import { ProgramFormContents } from './form/ProgramFormContents'
import { stageSchemaSection } from './form/programStage/StageForm'
import { ProgramStageListItem } from './form/ProgramStagesFormContents'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'description',
    'version',
    'featureType',
    'relatedProgram[id,displayName]',
    'categoryCombo[id,displayName]',
    'lastUpdated',
    'dataEntryForm',
    'programTrackedEntityAttributes',
    'trackedEntityType[id,displayName,name,trackedEntityTypeAttributes[trackedEntityAttribute[id,displayName,unique,valueType],mandatory,searchable,displayInList]]',
    'onlyEnrollOnce',
    'selectEnrollmentDatesInFuture',
    'displayIncidentDate',
    'selectIncidentDatesInFuture',
    'useFirstStageDuringRegistration',
    'dataEntryForm[id,displayName,htmlCode]',
    'programSections[id,displayName,description,access,sortOrder]',
    'programTrackedEntityAttributes[id,displayName,valueType,renderType,allowFutureDate,mandatory,searchable,displayInList,trackedEntityAttribute[id,displayName,unique]]',
    'style[color,icon]',
    'programStageLabel',
    'eventLabel',
    'enrollmentDateLabel',
    'incidentDateLabel',
    'enrollmentLabel',
    'followUpLabel',
    'orgUnitLabel',
    'relationshipLabel',
    'noteLabel',
    'displayFrontPageList',
    'programStages[id,displayName,access,description,program[id],sharing, notificationTemplates[id,name,displayName,access]]',
    'organisationUnits[id,displayName,path]',
    'sharing',
    'notificationTemplates[id,name,displayName, access]',
] as const

export type ProgramsFromFilters = PickWithFieldFilters<
    Program,
    typeof fieldFilters
>

export type ProgramValues = Omit<ProgramsFromFilters, 'sections'> & {
    sections: Section[]
    programStages: ProgramStageListItem[]
    dataEntryForm: DataEntryForm | null
}

type DataEntryForm = {
    id: string
    displayName: string
    htmlCode: string
}

const section = SECTIONS_MAP.program

export const programValueFormatter = <TValues extends Partial<ProgramValues>>(
    values: TValues
) => {
    return omit(values, 'programSections')
}

const createPatchQuery = (id: string, resource: string) => {
    return {
        resource: resource,
        id: id,
        type: 'json-patch',
        data: ({ operations }: Record<string, string>) => operations,
    } as const
}

const handlePatch = async ({
    id,
    resource,
    dataEngine,
    operations,
}: {
    id: string
    resource: string
    dataEngine: any
    operations: any
}) => {
    const query = createPatchQuery(id, resource)

    return await dataEngine.mutate(query, {
        variables: { operations },
    })
}

const handleStageNotificationDeletions = async ({
    stages,
    dataEngine,
    form,
}: {
    stages: ProgramStageListItem[]
    dataEngine: any
    form: any
}): Promise<string[]> => {
    // loop over any stages that have notifications marked as deleted
    const stagesWithNotificationDeletes = stages.filter((s) =>
        s.notificationTemplates?.some((nt) => nt.deleted)
    )
    if (stagesWithNotificationDeletes.length === 0) {
        return []
    }
    const stageToUpdate = stagesWithNotificationDeletes[0]

    const stagesUpdateResults = await Promise.allSettled(
        stagesWithNotificationDeletes.map((s) => {
            const notificationTemplates =
                stageToUpdate?.notificationTemplates ?? []
            const jsonPatchOperations = createJsonPatchOperations({
                values: {
                    notificationTemplates: notificationTemplates.filter(
                        (nt) => !nt.deleted
                    ),
                },
                dirtyFields: { notificationTemplates: true },
                originalValue: notificationTemplates,
            })
            return handlePatch({
                id: stageToUpdate.id,
                resource: stageSchemaSection.namePlural,
                dataEngine: dataEngine,
                operations: jsonPatchOperations,
            })
        })
    )

    const stagesUpdateDetails = stagesUpdateResults.map((update, i) => ({
        ...update,
        stageName: stagesWithNotificationDeletes[i].displayName,
        stageId: stagesWithNotificationDeletes[i].id,
    }))

    // manually update the form for any stages that succeeded to be reflected in the UI
    const stagesForUI = stages.map((stage) => {
        if (
            stagesUpdateDetails.find((s) => s.stageId === stage.id)?.status ===
            'fulfilled'
        ) {
            return {
                ...stage,
                notificationTemplates: stage.notificationTemplates?.filter(
                    (nt) => !nt.deleted
                ),
            }
        }
        return stage
    })
    form.change('programStages', stagesForUI)

    const stagesUpdateFailures = stagesUpdateDetails.filter(
        (update) => update.status === 'rejected'
    )

    return stagesUpdateFailures.map((failure) => failure.stageName)
}

export const useOnSubmitProgramEdit = (modelId: string) => {
    const submitEdit: EnhancedOnSubmit<ProgramValues> = useOnSubmitEdit({
        section,
        modelId,
    })
    const dataEngine = useDataEngine()
    const queryClient = useQueryClient()

    const handleFormDeletions = useHandleOnSubmitEditFormDeletions(
        section,
        'programSections',
        dataEngine,
        queryClient
    )

    return useMemo<EnhancedOnSubmit<ProgramValues>>(
        () => async (values, form, options) => {
            const formValues = form.getState().values
            const sections: Array<Section> = formValues.programSections
            const dataEntryForm: DataEntryForm = formValues.dataEntryForm
            const stages: ProgramStageListItem[] = formValues.programStages
            const notificationTemplates: any[] =
                formValues.notificationTemplates

            const stagesToDelete = stages.filter((stage) => stage.deleted)
            const stagesToKeep = stages.filter((stage) => !stage.deleted)
            const stageUpdateFailures = await handleStageNotificationDeletions({
                stages: stagesToKeep,
                dataEngine: dataEngine,
                form,
            })

            if (stageUpdateFailures.length > 0) {
                await queryClient.invalidateQueries({
                    queryKey: [{ resource: 'programStages' }],
                })
                return createFormError({
                    message: i18n.t(
                        'There was an error updating notification templates for some stages: {{stagesNames}}',
                        {
                            stagesNames: stageUpdateFailures.join(', '),
                            nsSeparator: '~-~',
                        }
                    ),
                })
            }

            const stagesDeletionResults = await Promise.allSettled(
                stagesToDelete.map((s) =>
                    dataEngine.mutate({
                        resource: 'programStages',
                        id: s.id,
                        type: 'delete',
                    })
                )
            )

            const stagesDeletionFailures = stagesDeletionResults
                .map((deletion, i) => ({
                    ...deletion,
                    stageName: stagesToDelete[i].displayName,
                }))
                .filter((deletion) => deletion.status === 'rejected')

            if (stagesDeletionFailures.length > 0) {
                await queryClient.invalidateQueries({
                    queryKey: [{ resource: 'programStages' }],
                })
                return createFormError({
                    message: i18n.t(
                        'There was an error deleting stages: {{stagesNames}}',
                        {
                            stagesNames: stagesDeletionFailures
                                .map((f) => f.stageName)
                                .join(', '),
                            nsSeparator: '~-~',
                        }
                    ),
                })
            }

            const { customFormDeleteResult, error } = await handleFormDeletions(
                sections,
                dataEntryForm
            )

            if (error) {
                return error
            }

            const trimmedValues = {
                ...values,
                programSections: sections.filter((section) => !section.deleted),
                programStages: stages.filter((stage) => !stage.deleted),
                dataEntryForm:
                    customFormDeleteResult &&
                    customFormDeleteResult?.[0]?.status !== 'rejected'
                        ? null
                        : values.dataEntryForm,
                notificationTemplates: notificationTemplates.filter(
                    (nTemplate) => !nTemplate.deleted
                ),
            } as ProgramValues

            return submitEdit(trimmedValues, form, options)
        },
        [submitEdit, handleFormDeletions, dataEngine, queryClient]
    )
}

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string

    const program = useQuery({
        queryFn: queryFn<ProgramValues>,
        queryKey: [
            {
                resource: 'programs',
                id: modelId,
                params: {
                    fields: fieldFilters.concat(),
                },
            },
        ] as const,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitProgramEdit(modelId)}
            initialValues={program.data}
            subscription={{}}
            mutators={{ ...arrayMutators }}
            validate={validate}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={ProgramFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <ProgramFormContents />
                                <DefaultFormFooter />
                            </form>
                            <DrawerRoot />
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    </SectionedFormProvider>
                )
            }}
        </FormBase>
    )
}
