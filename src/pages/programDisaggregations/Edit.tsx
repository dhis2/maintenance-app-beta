import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader, CenteredContent, NoticeBox } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import React, { useMemo } from 'react'
import { Form as ReactFinalForm } from 'react-final-form'
import { useParams } from 'react-router-dom'
import { z } from 'zod'
import { SectionedFormFooter } from '../../components'
import { LinkButton } from '../../components/LinkButton'
import { DEFAULT_FIELD_FILTERS, useBoundResourceQueryFn } from '../../lib'
import {
    CategoryCombo,
    ModelCollectionResponse,
    OptionMapping,
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
    categoryMappings: CategoryMappingsRecord
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

    const programIndicatorMappingsWithDataDimensionType =
        programIndicators.programIndicators.reduce((acc, indicator) => {
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
        }, {} as ProgramIndicatorMappingsRecord)

    const programIndicatorMappings = programIndicators.programIndicators.reduce(
        (acc, { id, ...rest }) => {
            const disaggregation = Object.fromEntries(
                rest.categoryCombo.categories.map((category, i) => [
                    category.id,
                    rest.categoryMappingIds[i],
                ])
            )
            acc[id] = {
                categoryCombo: rest.categoryCombo,
                disaggregation,
                attribute: {}, //for now doing everything in disaggregation
                name: rest.name,
                displayName: rest.displayName,
            }
            return acc
        },
        {} as ProgramIndicatorMappingsRecord
    )

    return {
        categoryMappings,
        programIndicatorMappings,
        programIndicatorMappingsWithDataDimensionType,
    }
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

    if (isLoading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }
    if (isError) {
        return (
            <NoticeBox title={i18n.t('Error')} error>
                {i18n.t('Could not load programs or indicators data.')}
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
        )
    }

    return (
        <div>
            <ReactFinalForm
                initialValues={initialValues}
                onSubmit={() => {}}
                mutators={{ ...arrayMutators }}
                destroyOnUnregister={false}
            >
                {() => {
                    return (
                        <form>
                            <ProgramDisaggregationFormFields
                                initialProgramIndicators={
                                    initialProgramIndicators
                                }
                            />
                            <SectionedFormFooter />
                        </form>
                    )
                }}
            </ReactFinalForm>
            <SectionedFormFooter>
                <SectionedFormFooter.FormActions>
                    <Button primary type="submit" onClick={() => {}}>
                        {i18n.t('Save and exit')}
                    </Button>
                    <LinkButton to={'..'}>
                        {i18n.t('Exit without saving')}
                    </LinkButton>
                </SectionedFormFooter.FormActions>
            </SectionedFormFooter>
        </div>
    )
}
