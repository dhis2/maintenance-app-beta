import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import { pick } from 'lodash'
import React, { useCallback, useMemo } from 'react'
import { Form as ReactFinalForm } from 'react-final-form'
import { useParams } from 'react-router-dom'
import { z } from 'zod'
import { SectionedFormFooter } from '../../components'
import { LinkButton } from '../../components/LinkButton'
import {
    DEFAULT_FIELD_FILTERS,
    parseErrorResponse,
    sectionNames,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useNavigateWithSearchState,
    usePatchModel,
} from '../../lib'
import { JsonPatchOperation } from '../../types'
import {
    CategoryCombo,
    ModelCollectionResponse,
    PickWithFieldFilters,
    Program,
    ProgramIndicator,
} from '../../types/generated'
import { ProgramDisaggregationFormFields } from './form'
import {
    categoryMapping,
    CategoryMappingsRecord,
    ProgramIndicatorMappingsRecord,
} from './form/programDisaggregationSchema'

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

export const apiResponseToFormValues = ({
    program,
    programIndicators,
}: {
    program: ProgramData
    programIndicators: ProgramIndicatorData
}) => {
    // group categoryMappings per categoryId
    const categoryMappings = program.categoryMappings.reduce((acc, mapping) => {
        acc[mapping.categoryId] = [
            ...(acc[mapping.categoryId] || []),
            {
                ...mapping,
                deleted: false,
                options: mapping.optionMappings.reduce((opts, opt) => {
                    opts[opt.optionId] = {
                        filter: opt.filter,
                        optionId: opt.optionId,
                    }
                    return opts
                }, {} as Record<string, { filter: string; optionId: string }>),
            },
        ]
        return acc
    }, {} as CategoryMappingsRecord)

    const programIndicatorMappings = programIndicators.programIndicators.reduce(
        (acc, indicator) => {
            const disAggCombo = indicator.categoryCombo
            const attributeCombo = indicator.attributeCombo

            const getMappingType = (
                catMapping: z.infer<typeof categoryMapping>
            ) => {
                const inCombo = [disAggCombo, attributeCombo].find((combo) =>
                    combo.categories.some(
                        (cat) => cat.id === catMapping.categoryId
                    )
                )
                return inCombo?.dataDimensionType
            }
            const mappingsList = Object.values(categoryMappings).flat()
            const mappingByComboType = {
                disaggregation: {},
                attribute: {},
            }

            indicator.categoryMappingIds.forEach((categoryMappingId) => {
                const categoryMapping = mappingsList.find(
                    (cm) => cm.id === categoryMappingId
                )
                if (!categoryMapping) {
                    return acc
                }
                const type = getMappingType(categoryMapping)
                if (!type) {
                    return acc
                }
                const key =
                    type === CategoryCombo.dataDimensionType.DISAGGREGATION
                        ? 'disaggregation'
                        : 'attribute'

                mappingByComboType[key] = {
                    ...mappingByComboType[key],
                    [categoryMapping.categoryId]: categoryMappingId,
                }
            })
            acc[indicator.id] = {
                ...indicator,
                ...mappingByComboType,
            }
            return acc
        },
        {} as ProgramIndicatorMappingsRecord
    )

    return {
        categoryMappings,
        programIndicatorMappings,
    }
}

export const useUpdateProgramIndicatorMutation = () => {
    const engine = useDataEngine()

    const patch = useCallback(
        async (
            programIndicatorId: string,
            newCategoryCombo: { id: string; displayName: string } | null,
            newCategoryMappingsIds: string[]
        ) => {
            const patchOperations = {
                type: 'json-patch',
                resource: SECTIONS_MAP.programIndicator.namePlural,
                id: programIndicatorId,
                data: [
                    {
                        op: 'replace',
                        path: '/categoryCombo',
                        value: newCategoryCombo,
                    },
                    {
                        op: 'replace',
                        path: '/categoryMappingIds',
                        value: newCategoryMappingsIds,
                    },
                ],
            } as const

            try {
                const response = await engine.mutate(patchOperations)
                return { data: response }
            } catch (error) {
                return { error: parseErrorResponse(error) }
            }
        },
        [engine]
    )

    return patch
}

export const useOnSubmit = (
    programId: string,
    initialValues: ProgramDisaggregationFormValues
) => {
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )
    const patchPrograms = usePatchModel(
        programId,
        SECTIONS_MAP.program.namePlural
    )
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
            const { deleted, ...catMappings } = values.categoryMappings
            const cleanCatMappings = Object.fromEntries(
                Object.entries(catMappings).filter(
                    ([key]) => !deleted || !deleted.includes(key)
                )
            )
            const newCategoryMappings = Object.values(cleanCatMappings)
                .flat()
                .map(({ id, categoryId, mappingName, options }) => ({
                    id,
                    categoryId,
                    mappingName,
                    optionMappings:
                        options &&
                        Object.entries(options).map(([id, value]) => ({
                            optionId: id,
                            filter: value.filter,
                        })),
                }))
            const programsJsonPatchOperations = [
                {
                    op: 'replace',
                    path: '/categoryMappings',
                    value: newCategoryMappings,
                },
            ] as JsonPatchOperation[]
            const response = await patchPrograms(programsJsonPatchOperations)
            if (response.error) {
                saveAlert.show({
                    message: i18n.t(
                        'Error while saving disaggregation categories'
                    ),
                    error: true,
                })
                return
            }

            Object.keys(values.programIndicatorMappings).map(
                async (programIndicatorId) => {
                    const programIndicatorMapping =
                        values.programIndicatorMappings[programIndicatorId]
                    const newCategoryCombo =
                        programIndicatorMapping.categoryCombo
                            ? pick(programIndicatorMapping.categoryCombo, [
                                  'id',
                                  'displayName',
                              ])
                            : null
                    const newCategoryMappingsIds =
                        programIndicatorMapping.categoryCombo
                            ? programIndicatorMapping.categoryCombo.categories.map(
                                  (category) =>
                                      programIndicatorMapping.disaggregation[
                                          category.id
                                      ]
                              )
                            : []

                    const response = await patchProgramIndicators(
                        programIndicatorId,
                        newCategoryCombo,
                        newCategoryMappingsIds
                    )
                    if (response.error) {
                        saveAlert.show({
                            message: i18n.t(
                                `Error while saving mappings for program indicator with id ${programIndicatorId}`
                            ),
                            error: true,
                        })
                    }
                }
            )
            const deletedPiMappings = Object.keys(
                initialValues.programIndicatorMappings
            ).filter((piMapping) => !values.programIndicatorMappings[piMapping])
            deletedPiMappings.map(async (programIndicatorId) => {
                const response = await patchProgramIndicators(
                    programIndicatorId,
                    null,
                    []
                )
                if (response.error) {
                    saveAlert.show({
                        message: i18n.t(
                            `Error while deleting mappings for program indicator with id ${programIndicatorId}`
                        ),
                        error: true,
                    })
                }
            })
            navigate(`/${SECTIONS_MAP.programDisaggregation.namePlural}`)
        },
        [saveAlert, navigate, patchPrograms]
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
        <div>
            <ReactFinalForm
                initialValues={initialValues}
                onSubmit={useOnSubmit(id, initialValues)}
                mutators={{ ...arrayMutators }}
                destroyOnUnregister={false}
            >
                {({ handleSubmit }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <ProgramDisaggregationFormFields
                                initialProgramIndicators={
                                    initialProgramIndicators
                                }
                            />
                            <SectionedFormFooter>
                                <SectionedFormFooter.FormActions>
                                    <Button primary type="submit">
                                        {i18n.t('Save and exit')}
                                    </Button>
                                    <LinkButton to={'..'}>
                                        {i18n.t('Exit without saving')}
                                    </LinkButton>
                                </SectionedFormFooter.FormActions>
                            </SectionedFormFooter>
                        </form>
                    )
                }}
            </ReactFinalForm>
        </div>
    )
}
