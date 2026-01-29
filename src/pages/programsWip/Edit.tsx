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
} from '../../lib'
import { EnhancedOnSubmit } from '../../lib/form/useOnSubmit'
import { PickWithFieldFilters, Program } from '../../types/generated'
import { validate } from './form'
import { ProgramFormDescriptor } from './form/formDescriptor'
import { ProgramFormContents } from './form/ProgramFormContents'
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
    'programStages[id,displayName,access,description,program[id],sharing]',
    'organisationUnits[id,displayName,path]',
    'sharing',
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

            const stagesToDelete = stages.filter((stage) => stage.deleted)
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
