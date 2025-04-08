import { useQuery } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import React, { useMemo } from 'react'
import { Form as ReactFinalForm } from 'react-final-form'
import { useParams } from 'react-router-dom'
import { DEFAULT_FIELD_FILTERS, useBoundResourceQueryFn } from '../../lib'
import {
    CategoryMapping,
    OptionMapping,
    PickWithFieldFilters,
    Program,
} from '../../types/generated'
import { ProgramDisaggregationFormFields } from './form'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'categoryMappings',
] as const

export type ProgramFormValues = PickWithFieldFilters<
    Program,
    typeof fieldFilters
>

type FormValueOptionMapping = OptionMapping & {
    deleted: boolean
}
type CategoryMappingFormValues = Record<
    string, // categoryId
    Array<
        Omit<CategoryMapping, 'optionMappings'> & {
            options: FormValueOptionMapping[]
        }
    >
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
        queryFn: queryFn<ProgramFormValues>,
    })

    const initialValues = useMemo(() => {
        const res = programQuery.data?.categoryMappings
        if (!res) {
            return { categoryMappings: {} }
        }
        console.log('programQuery.data?.categoryMappings', res)
        const categoryIds = res?.map((mapping) => mapping.categoryId)
        console.log({ categoryIds })
        const categoryMappings: CategoryMappingFormValues = {}
        const mappingsPerCategory = categoryIds?.forEach((id) => {
            const mappings = res.filter((mapping) => mapping.categoryId === id)
            const k = categoryMappings[id]
            categoryMappings[id] = mappings
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
    }, [programQuery.data])

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
                        </form>
                    )
                }}
            </ReactFinalForm>
        </div>
    )
}
