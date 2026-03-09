import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import { omit } from 'lodash'
import React, { useCallback, useMemo } from 'react'
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
import {
    createFormError,
    createJsonPatchOperations,
    DEFAULT_FIELD_FILTERS,
    parseErrorResponse,
    SectionedFormProvider,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useOnSubmitEdit,
} from '../../lib'
import { EnhancedOnSubmit } from '../../lib/form/useOnSubmit'
import { DataEngine, JsonPatchOperation } from '../../types'
import { PickWithFieldFilters, Program } from '../../types/generated'
import {
    eventProgramInitialValues as programFormInitialValues,
    eventProgramValidate,
} from './form'
import { EventProgramFormContents } from './form/eventProgram/EventProgramFormContents'
import { EventProgramFormDescriptor } from './form/eventProgram/eventProgramFormDescriptor'
import {
    StageFormValues,
    stageSchemaSection,
} from './form/programStage/StageForm'
import { ProgramStageListItem } from './form/ProgramStagesFormContents'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'programType',
    'name',
    'shortName',
    'code',
    'description',
    'version',
    'featureType',
    // 'relatedProgram[id,displayName]',
    // 'categoryCombo[id,displayName]',
    // 'lastUpdated',
    // 'dataEntryForm',
    // 'programTrackedEntityAttributes',
    // 'trackedEntityType[id,displayName,name,trackedEntityTypeAttributes[trackedEntityAttribute[id,displayName,unique,valueType],mandatory,searchable,displayInList]]',
    // 'onlyEnrollOnce',
    // 'selectEnrollmentDatesInFuture',
    // 'displayIncidentDate',
    // 'selectIncidentDatesInFuture',
    // 'useFirstStageDuringRegistration',
    // 'ignoreOverdueEvents',
    // 'dataEntryForm[id,displayName,htmlCode]',
    // 'programSections[id,displayName,description,access,sortOrder]',
    // 'programTrackedEntityAttributes[id,displayName,valueType,renderType,allowFutureDate,mandatory,searchable,displayInList,trackedEntityAttribute[id,displayName,unique]]',
    'style[color,icon]',
    // 'programStageLabel',
    // 'eventLabel',
    // 'enrollmentDateLabel',
    'incidentDateLabel',
    // 'enrollmentLabel',
    // 'followUpLabel',
    // 'orgUnitLabel',
    // 'relationshipLabel',
    // 'noteLabel',
    // 'displayFrontPageList',
    'programStages[id,name,notificationTemplates[id,name,displayName,access],programStageDataElements[id,dataElement[id,displayName,valueType],compulsory,displayInReports,allowFutureDate,skipAnalytics,skipSynchronization,renderType,sortOrder]],programStageSections[id,displayName]',
    // 'organisationUnits[id,displayName,path]',
    // 'sharing',
    // 'notificationTemplates[id,name,displayName, access]',
    'expiryDays',
    'expiryPeriodType',
    'completeEventsExpiryDays',
    'openDaysAfterCoEndDate',
    // 'minAttributesRequiredToSearch',
    // 'maxTeiCountToReturn',
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

const handleStageNotificationDeletions = async ({
    stages,
    dataEngine,
}: {
    stages: ProgramStageListItem[]
    dataEngine: DataEngine
}): Promise<string[]> => {
    // stage notification templates marked for deletion
    const notificationTemplatesToDelete = stages.flatMap(
        (stage) =>
            stage.notificationTemplates?.filter(
                (template) => template.deleted
            ) ?? []
    )

    if (notificationTemplatesToDelete.length === 0) {
        return []
    }

    const notificationTemplateDeletionResults = await Promise.allSettled(
        notificationTemplatesToDelete.map((template) =>
            dataEngine.mutate({
                resource: 'programNotificationTemplates',
                id: template.id,
                type: 'delete',
            })
        )
    )

    const notificationDeletedFailures = notificationTemplateDeletionResults
        .filter((result) => result.status === 'rejected')
        .map(
            (_failure, index) =>
                notificationTemplatesToDelete?.[index]?.displayName ?? ''
        )

    return notificationDeletedFailures
}

export const useOnSubmitProgramEdit = (modelId: string) => {
    const submitEdit: EnhancedOnSubmit<ProgramValues> = useOnSubmitEdit({
        section,
        modelId,
    })
    const dataEngine = useDataEngine()
    const queryClient = useQueryClient()

    const handleStagePatch = useCallback(
        async (operations: JsonPatchOperation[], id: string) => {
            try {
                const response = await dataEngine.mutate(
                    {
                        resource: stageSchemaSection.namePlural,
                        id: id,
                        type: 'json-patch',
                        data: ({ operations }: Record<string, string>) =>
                            operations,
                    } as const,
                    {
                        variables: { operations },
                    }
                )
                return { data: response }
            } catch (error) {
                return { error: parseErrorResponse(error) }
            }
        },
        [dataEngine]
    )

    // const handleFormDeletions = useHandleOnSubmitEditFormDeletions(
    //     section,
    //     'programSections',
    //     dataEngine,
    //     queryClient
    // )

    return useMemo<EnhancedOnSubmit<ProgramValues>>(
        () => async (values, form, options) => {
            const formValues = form.getState().values

            // const sections: Array<Section> = formValues.programSections
            // const dataEntryForm: DataEntryForm = formValues.dataEntryForm
            const stages: ProgramStageListItem[] = formValues.programStages
            // const notificationTemplates: ProgramNotificationListItem[] =
            //     formValues.notificationTemplates

            // const stagesToDelete = stages.filter((stage) => stage.deleted)

            const stageNotificationTemplateDeleteFailures =
                await handleStageNotificationDeletions({
                    stages,
                    dataEngine,
                })

            if (stageNotificationTemplateDeleteFailures.length > 0) {
                await queryClient.invalidateQueries({
                    queryKey: [{ resource: 'programNotificationTemplates' }],
                })
                return createFormError({
                    message: i18n.t(
                        'There was an error updating notification templates for some stages: {{stagesNames}}',
                        {
                            stagesNames:
                                stageNotificationTemplateDeleteFailures.join(
                                    ', '
                                ),
                            nsSeparator: '~-~',
                        }
                    ),
                })
            }

            // const stagesDeletionResults = await Promise.allSettled(
            //     stagesToDelete.map((stage) =>
            //         dataEngine.mutate({
            //             resource: 'programStages',
            //             id: stage.id,
            //             type: 'delete',
            //         })
            //     )
            // )

            // const stagesDeletionFailures = stagesDeletionResults
            //     .map((deletion, index) => ({
            //         ...deletion,
            //         stageName: stagesToDelete[index].displayName,
            //     }))
            //     .filter((deletion) => deletion.status === 'rejected')

            // if (stagesDeletionFailures.length > 0) {
            //     await queryClient.invalidateQueries({
            //         queryKey: [{ resource: 'programStages' }],
            //     })
            //     return createFormError({
            //         message: i18n.t(
            //             'There was an error deleting stages: {{stagesNames}}',
            //             {
            //                 stagesNames: stagesDeletionFailures
            //                     .map((failure) => failure.stageName)
            //                     .join(', '),
            //                 nsSeparator: '~-~',
            //             }
            //         ),
            //     })
            // }

            // const { customFormDeleteResult, error } = await handleFormDeletions(
            //     sections,
            //     dataEntryForm
            // )

            // if (error) {
            //     return error
            // }

            // const sections = values.programStages[0]?.programStageSections ?? []
            // const dataEntryForm = formValues.dataEntryForm

            // const { customFormDeleteResult, error } = await handleDeletions(
            //     sections,
            //     dataEntryForm
            // )

            // if (error) {
            //     return error
            // }
            // const nonDeletedProgramStageSections = sections.filter(
            //     (section) => !section.deleted
            // )
            const stageTrimmedValues = values
                .programStages[0] as Partial<StageFormValues>
            // programStageSections: nonDeletedProgramStageSections,
            // dataEntryForm:
            //     customFormDeleteResult &&
            //     customFormDeleteResult?.[0]?.status !== 'rejected'
            //         ? null
            //         : values.dataEntryForm,
            // } as Partial<StageFormValues>

            const stageJsonPatchOperations = createJsonPatchOperations({
                values: stageTrimmedValues,
                dirtyFields: { programStageDataElements: true },
                originalValue: form.getState().initialValues.programStages,
            })
            const response = await handleStagePatch(
                stageJsonPatchOperations,
                stageTrimmedValues.id!
            )
            if (response.error) {
                return createFormError(response.error)
            }

            const trimmedValues = {
                ...values,
                // programSections: sections.filter((section) => !section.deleted),
                programStages: stages.map((stage) => ({ id: stage.id })),
                // dataEntryForm:
                //     customFormDeleteResult &&
                //     customFormDeleteResult?.[0]?.status !== 'rejected'
                //         ? null
                //         : values.dataEntryForm,
                // notificationTemplates: notificationTemplates.filter(
                //     (nTemplate) => !nTemplate.deleted
                // ),
            } as ProgramValues

            return submitEdit(trimmedValues, form, options)
        },
        [submitEdit, handleStagePatch, dataEngine, queryClient]
    )
}

export const EditEventProgram = () => {
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

    const onSubmit = useOnSubmitProgramEdit(modelId)

    return (
        <FormBase
            onSubmit={onSubmit}
            initialValues={program?.data ?? programFormInitialValues}
            subscription={{}}
            mutators={{ ...arrayMutators }}
            validate={eventProgramValidate}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={EventProgramFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <EventProgramFormContents />
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
