import { useCallback, useMemo } from 'react'
import { useQueryParam, ObjectParam, UrlUpdateType } from 'use-query-params'
import {
    Schema,
    useSchemaFromHandle,
    CustomObjectParam,
    SectionListFilterObjectParamType,
    getViewConfigForSection,
    IDENTIFIABLE_KEY,
} from '../../../lib'
import { usePaginationQueryParams } from '../SectionListPagination'

type ObjectParamType = typeof ObjectParam.default

type Filters = Record<string, string | undefined>

const getVerifiedFiltersForSchema = (
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

const getRelevantFiltersForSchema = (
    filters: SectionListFilterObjectParamType,
    schema: Schema
): Filters => {
    if (!filters) {
        return {}
    }
    const viewConfig = getViewConfigForSection(schema.singular)
    const relevantFilterKeys =
        viewConfig.filters.available.concat('identifiable')
    /* TODO: verify values for filters */
    const relevantFilters = Object.entries(filters).filter(([key]) => {
        return key === IDENTIFIABLE_KEY || schema.properties[key]
    })
    return Object.fromEntries(relevantFilters)
}

const useFilterQueryParam = () => {
    return useQueryParam('filter', CustomObjectParam)
}

export const useSectionListFilters = () => {
    const [filter, setFilterParam] = useFilterQueryParam()
    const [, setPagingParam] = usePaginationQueryParams()

    const schema = useSchemaFromHandle()

    // override setFilter to be able to reset Page when filter changes
    const setFilter = useCallback(
        (
            filter: Parameters<typeof setFilterParam>[0],
            updateType?: UrlUpdateType
        ) => {
            setFilterParam(filter, updateType)
            // set page to 1 when filter changes
            // do this here instead of useEffect to prevent unnecessary refetches
            setPagingParam((pagingParams) => ({ ...pagingParams, page: 1 }))
        },
        [setFilterParam, setPagingParam]
    )

    return useMemo(
        () => [getVerifiedFiltersForSchema(filter, schema), setFilter] as const,
        [filter, schema, setFilter]
    )
}

/** Helper-hook to select a single filter.
 * eg. [domainType, setDomainType] = useSectionListFilter('domainType')
 */
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

const parseToQueryFilter = (filters: Filters): string[] => {
    const { [IDENTIFIABLE_KEY]: identifiableValue, ...restFilters } = filters
    const queryFilters: string[] = []

    const identifiableFilter = `identifiable:token:${identifiableValue}`
    if (identifiableValue) {
        queryFilters.push(identifiableFilter)
    }
    Object.entries(restFilters).forEach(([key, value]) => {
        queryFilters.push(`${key}:eq:${value}`)
    })
    return queryFilters
}

export const useSectionListQueryFilter = () => {
    const [filters] = useSectionListFilters()

    return useMemo(() => {
        return parseToQueryFilter(filters)
    }, [filters])
}

export const useQueryParamsForModelGist = () => {
    const [paginationParams] = usePaginationQueryParams()
    const filterParams = useSectionListQueryFilter()

    return useMemo(() => {
        return {
            ...paginationParams,
            filter: filterParams,
        }
    }, [paginationParams, filterParams])
}
