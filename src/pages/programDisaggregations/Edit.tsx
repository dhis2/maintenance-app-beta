import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader, NoticeBox } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import React, { useMemo } from 'react'
import { Form as ReactFinalForm } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    DefaultSectionedFormFooter,
    DefaultSectionedFormSidebar,
    SectionedFormFooter,
    SectionedFormLayout,
} from '../../components'
import {
    DEFAULT_FIELD_FILTERS,
    SectionedFormProvider,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useNavigateWithSearchState,
} from '../../lib'
import {
    ModelCollectionResponse,
    PickWithFieldFilters,
    Program,
    ProgramIndicator,
} from '../../types/generated'
import { ProgramDisaggregationFormFields } from './form'
import { apiResponseToFormValues } from './form/apiResponseToFormValues'
import {
    CategoryMappingsRecord,
    ProgramIndicatorMappingsRecord,
} from './form/programDisaggregationSchema'
import {
    useUpdateProgramIndicatorMutation,
    useUpdateProgramMutation,
} from './form/useUpdateProgramIndicatorMutation'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'categoryMappings',
] as const

const programIndicatorFieldFilters = [
    'id',
    'name',
    'displayName',
    'categoryMappingIds',
    'attributeCombo[id, displayName, dataDimensionType, categories[id, displayName]]',
    'categoryCombo[id, displayName, dataDimensionType, categories[id, displayName]]',
    'aggregateExportDataElement',
] as const

export type ProgramData = PickWithFieldFilters<Program, typeof fieldFilters>
export type ProgramIndicatorData = ModelCollectionResponse<
    PickWithFieldFilters<ProgramIndicator, typeof programIndicatorFieldFilters>,
    'programIndicators'
>
export type ProgramIndicatorWithMapping = {
    displayName: string
    name: string
    id: string
}
type ProgramDisaggregationFormValues = {
    categoryMappings: CategoryMappingsRecord & {
        deleted?: string[]
    }
    programIndicatorMappings: ProgramIndicatorMappingsRecord
}

export const useOnSubmit = (
    programId: string,
    initialValues: ProgramDisaggregationFormValues
) => {
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )

    const patchPrograms = useUpdateProgramMutation(programId)
    const patchProgramIndicators = useUpdateProgramIndicatorMutation()
    const navigate = useNavigateWithSearchState()

    return useMemo(
        () => async (values: ProgramDisaggregationFormValues) => {
            if (!values) {
                console.error('Tried to save new object without any changes', {
                    values,
                })
                saveAlert.show({
                    message: i18n.t('Cannot save empty object'),
                    error: true,
                })
                return
            }

            const response = await patchPrograms(values.categoryMappings)

            if (response.error) {
                saveAlert.show({
                    message: i18n.t(
                        'Error while saving disaggregation categories'
                    ),
                    error: true,
                })
                return
            }

            const piMappingsUpdateResponses = await Promise.all(
                Object.keys(values.programIndicatorMappings).map(
                    async (programIndicatorId) => {
                        const programIndicatorMapping =
                            values.programIndicatorMappings[programIndicatorId]

                        const response = await patchProgramIndicators(
                            programIndicatorId,
                            programIndicatorMapping
                        )

                        return { ...response, id: programIndicatorId }
                    }
                )
            )

            const piMappingsDeleteResponses = await Promise.all(
                Object.keys(initialValues.programIndicatorMappings)
                    .filter(
                        (piMapping) =>
                            !values.programIndicatorMappings[piMapping]
                    )
                    .map(async (programIndicatorId) => {
                        const response = await patchProgramIndicators(
                            programIndicatorId,
                            null
                        )
                        return { ...response, id: programIndicatorId }
                    })
            )

            const piMappingsResponses = [
                ...piMappingsUpdateResponses,
                ...piMappingsDeleteResponses,
            ]

            const errors = piMappingsResponses.filter((res) => res.error)
            if (errors.length > 0) {
                saveAlert.show({
                    message: i18n.t(
                        `Error while updating mappings for program indicators with ids: ${errors
                            .map((r) => r.id)
                            .join(' - ')}`
                    ),
                    error: true,
                })
            } else {
                navigate(`/${SECTIONS_MAP.programDisaggregation.namePlural}`)
            }
        },
        [
            saveAlert,
            navigate,
            patchPrograms,
            initialValues.programIndicatorMappings,
            patchProgramIndicators,
        ]
    )
}

export const Component = () => {
    const id = useParams().id!
    const queryFn = useBoundResourceQueryFn()
    const query = {
        resource: 'programs',
        id: id,
        params: { fields: fieldFilters.concat() },
    }

    const programQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<ProgramData>,
    })

    const programIndicatorsQuery = useQuery({
        queryKey: [
            {
                resource: 'programIndicators',
                params: {
                    fields: programIndicatorFieldFilters.concat(),
                    filter: [`program.id:eq:${id}`, 'categoryMappingIds:gt:0'],
                    pageSize: 200,
                },
            },
        ],
        queryFn: queryFn<ProgramIndicatorData>,
    })

    const isLoading = programQuery.isLoading || programIndicatorsQuery.isLoading
    const isError = programQuery.isError || programIndicatorsQuery.isError

    const initialValues: ProgramDisaggregationFormValues = useMemo(() => {
        if (programQuery.data && programIndicatorsQuery.data) {
            return apiResponseToFormValues({
                program: programQuery.data,
                programIndicators: programIndicatorsQuery.data,
            })
        }

        return {
            categoryMappings: {},
            programIndicatorMappings: {},
        }
    }, [programQuery.data, programIndicatorsQuery.data])

    const initialProgramIndicators: ProgramIndicatorWithMapping[] =
        useMemo(() => {
            if (initialValues.programIndicatorMappings) {
                return Object.entries(
                    initialValues.programIndicatorMappings
                ).map(([id, value]) => ({
                    id,
                    name: value.name,
                    displayName: value.displayName,
                }))
            }
            return []
        }, [initialValues.programIndicatorMappings])

    return (
        <SectionedFormProvider
            formDescriptor={{
                name: 'programDisaggregationForm',
                label: i18n.t('program_disaggregation_form'),
                sections: [
                    {
                        name: 'programIndicatorMappings',
                        label: i18n.t('Program indicator mappings'),
                        fields: [
                            {
                                name: 'programIndicatorMappings',
                                label: i18n.t('program_indicator_mappings'),
                            },
                        ],
                    },
                    {
                        name: 'disaggregationCategories',
                        label: i18n.t('Disaggregation categories'),
                        fields: [
                            {
                                name: 'categoryMappings',
                                label: i18n.t(
                                    'disaggregation_category_mappings'
                                ),
                            },
                        ],
                    },
                ],
            }}
        >
            <ReactFinalForm
                initialValues={initialValues}
                onSubmit={useOnSubmit(id, initialValues)}
                mutators={{ ...arrayMutators }}
                destroyOnUnregister={false}
            >
                {({ handleSubmit }) => {
                    return (
                        <>
                            {isLoading && (
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <CircularLoader />
                                </div>
                            )}
                            {isError && (
                                <NoticeBox title={i18n.t('Error')} error>
                                    {i18n.t(
                                        'Could not load programs or indicators data.'
                                    )}
                                    <br />
                                    <Button
                                        small
                                        onClick={() => {
                                            programIndicatorsQuery.refetch()
                                            programQuery.refetch()
                                        }}
                                    >
                                        {i18n.t('Retry')}
                                    </Button>
                                </NoticeBox>
                            )}
                            {!isLoading && !isError && (
                                <SectionedFormLayout
                                    sidebar={<DefaultSectionedFormSidebar />}
                                    footer={<DefaultSectionedFormFooter />}
                                >
                                    <form onSubmit={handleSubmit}>
                                        <ProgramDisaggregationFormFields
                                            initialProgramIndicators={
                                                initialProgramIndicators
                                            }
                                        />
                                        <SectionedFormFooter />
                                    </form>
                                </SectionedFormLayout>
                            )}
                        </>
                    )
                }}
            </ReactFinalForm>
        </SectionedFormProvider>
    )
}
