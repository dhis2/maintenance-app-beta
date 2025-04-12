import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import React, { useMemo } from 'react'
import { Form as ReactFinalForm } from 'react-final-form'
import { useParams } from 'react-router-dom'
import { SectionedFormFooter, SectionedFormLayout } from '../../components'
import { LinkButton } from '../../components/LinkButton'
import { DEFAULT_FIELD_FILTERS, useBoundResourceQueryFn } from '../../lib'
import {
    ModelCollectionResponse,
    OptionMapping,
    PickWithFieldFilters,
    Program,
    ProgramIndicator,
} from '../../types/generated'
import { ProgramDisaggregationFormFields } from './form'
import { apiResponseToFormValues } from './form/programDisaggregationSchema'

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

type CategoryMappingValue = {
    categoryId: string
    id: string
    mappingName: string
    options: Record<string, OptionMapping>
    deleted: boolean
}
type CategoryMappingFormValues = Record<
    string, // categoryId
    CategoryMappingValue[]
>
type ProgramDisaggregationFormValues = {
    categoryMappings: CategoryMappingFormValues
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

    const initialValues = useMemo(() => {
        const res = programQuery.data?.categoryMappings
        if (!res) {
            return { categoryMappings: {} }
        }
        if (programQuery.data && programIndicatorsQuery.data) {
            const formValues = apiResponseToFormValues({
                program: programQuery.data,
                programIndicators: programIndicatorsQuery.data,
            })
            console.log({ formValues })
        }
        const categoryIds = res?.map((mapping) => mapping.categoryId)
        const categoryMappings: CategoryMappingFormValues = {}
        const mappingsPerCategory = categoryIds?.forEach((id) => {
            const mappings = res.filter((mapping) => mapping.categoryId === id)

            categoryMappings[id as keyof CategoryMappingFormValues] = mappings
                .filter((mapping) => !!mapping)
                .map(({ categoryId, id, mappingName, optionMappings }) => {
                    const options = optionMappings.reduce((acc, curr) => {
                        acc[curr.optionId] = curr
                        return acc
                    }, {} as Record<string, OptionMapping>)
                    return {
                        categoryId,
                        id,
                        mappingName,
                        options,
                        deleted: false,
                    }
                })
        })
        console.log('mappingsPerCategory', categoryMappings)
        return {
            categoryMappings, //: Object.values(categoryMappings),
        }
    }, [programQuery.data, programIndicatorsQuery.data])

    return (
        <div>
            <span>Placeholder for program disaggregations (edit){id}</span>
            <ReactFinalForm
                initialValues={initialValues}
                onSubmit={() => {}}
                mutators={{ ...arrayMutators }}
                destroyOnUnregister={false}
            >
                {() => {
                    return (
                        <form>
                            <ProgramDisaggregationFormFields />
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
