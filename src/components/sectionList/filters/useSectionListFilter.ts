import { useCallback, useMemo, useEffect } from 'react'
import { useQueryParam, ObjectParam } from 'use-query-params'
import { Schema, useSchemaFromHandle, CustomObjectParam } from '../../../lib'
import { QueryRefetchFunction } from '../../../types'
import { GistParams } from '../../../types/generated'

type ObjectParamType = typeof ObjectParam.default

type Filters = Record<string, string | undefined>

// special key for handling search for identifiable objects
// eg. searches for name, code, id and shortname
// this would translate to "token" in the old API, but does not exist in GIST-API
export const IDENTIFIABLE_KEY = 'identifiable'

const IDENTIFIABLE_FIELDS = {
    name: {
        operator: 'ilike',
    },
    code: {
        operator: 'ilike',
    },
    shortName: {
        operator: 'ilike',
    },
    id: {
        operator: 'eq',
    },
}

const getRelevantFiltersForSchema = (
    filters: ObjectParamType,
    schema: Schema
): Filters => {
    if (!filters) {
        return {}
    }
    /* TODO: verify values for filters */
    const relevantFilters = Object.entries(filters).filter(([key]) => {
        return key === IDENTIFIABLE_KEY || schema.properties[key]
    })
    return Object.fromEntries(relevantFilters)
}

const useFilterQueryParam = () => {
    return useQueryParam('filter', CustomObjectParam)
}

export const useSectionListFilters = (): ReturnType<
    typeof useQueryParam<Filters | null | undefined, Filters>
> => {
    const [filter, setFilter] = useFilterQueryParam()
    const schema = useSchemaFromHandle()

    return useMemo(
        () => [getRelevantFiltersForSchema(filter, schema), setFilter],
        [filter, schema, setFilter]
    )
}

export const useSectionListFilter = (
    filterKey: string
): [string | undefined, (value: string | undefined) => void] => {
    const [filters, setFilters] = useSectionListFilters()

    const boundSetFilter = useCallback(
        (value: string | undefined) => {
            if (!value) {
                setFilters((filters) => {
                    if (!filters) {
                        return undefined
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [filterKey]: _, ...rest } = filters
                    return Object.keys(rest).length === 0 ? undefined : rest
                })
            } else {
                setFilters((filters) => ({ ...filters, [filterKey]: value }))
            }
        },
        [filterKey, setFilters]
    )

    return [filters?.[filterKey] ?? undefined, boundSetFilter]
}

export type ParseToQueryFilterResult = {
    filter: string[]
    rootJunction: GistParams['rootJunction']
}

const parseToQueryFilter = (filters: Filters): ParseToQueryFilterResult => {
    const { [IDENTIFIABLE_KEY]: identifiableValue, ...restFilters } = filters
    const queryFilters: string[] = []

    const hasOtherFilters = Object.keys(restFilters).length > 0
    // Groups are a powerful way to combine filters,
    // here we use them for identifiable filters, to group them with "OR" and
    // rest of the filters with "AND".
    // Unfortunately, it doesn't work to use groups without at least two,
    // so we need to add them conditionally.
    // see https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-239/metadata-gist.html#gist_parameters_filter
    const identifiableFilterGroup = hasOtherFilters ? `0:` : ''
    if (identifiableValue) {
        Object.entries(IDENTIFIABLE_FIELDS).forEach(([key, { operator }]) => {
            queryFilters.push(
                `${identifiableFilterGroup}${key}:${operator}:${identifiableValue}`
            )
        })
    }
    const restFilterGroup = identifiableValue ? `1:` : ''
    Object.entries(restFilters).forEach(([key, value]) => {
        queryFilters.push(`${restFilterGroup}${key}:eq:${value}`)
    })
    // when there are no other filters than identifiable, we can't group them
    // and thus we need to set rootJunction to OR
    const rootJunction =
        identifiableValue && !hasOtherFilters ? 'OR' : undefined
    return { filter: queryFilters, rootJunction }
}

export const useSectionListQueryFilter = () => {
    const [filters] = useSectionListFilters()

    return useMemo(() => {
        return parseToQueryFilter(filters)
    }, [filters])
}

export const useSectionListFilterRefetch = (refetch: QueryRefetchFunction) => {
    const { filter, rootJunction } = useSectionListQueryFilter()

    useEffect(() => {
        refetch({
            filter,
            rootJunction,
        })
    }, [refetch, filter, rootJunction])
}
