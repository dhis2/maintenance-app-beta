import { useCallback, useMemo } from 'react'
import { useQueryParam, ObjectParam, UrlUpdateType } from 'use-query-params'
import {
    Schema,
    useSchemaFromHandle,
    CustomObjectParam,
    GistParams,
} from '../../../lib'
import { usePaginationQueryParams } from '../SectionListPagination'

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

const parseToGistQueryFilter = (filters: Filters): string[] => {
    const { [IDENTIFIABLE_KEY]: identifiableValue, ...restFilters } = filters
    const queryFilters: string[] = []

    // Groups are a powerful way to combine filters,
    // here we use them for identifiable filters, to group them with "OR" and
    // rest of the filters with "AND".
    // see https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-239/metadata-gist.html#gist_parameters_filter
    if (identifiableValue) {
        const identifiableFilterGroup = `0:`
        Object.entries(IDENTIFIABLE_FIELDS).forEach(([key, { operator }]) => {
            queryFilters.push(
                `${identifiableFilterGroup}${key}:${operator}:${identifiableValue}`
            )
        })
    }
    let restFilterGroup: number | undefined
    if (identifiableValue) {
        restFilterGroup = 1
    }
    Object.entries(restFilters).forEach(([key, value]) => {
        const group = restFilterGroup ? `${restFilterGroup++}:` : ''
        queryFilters.push(`${group}${key}:eq:${value}`)
    })
    return queryFilters
}

export const useSectionListQueryFilter = () => {
    const [filters] = useSectionListFilters()

    return useMemo(() => {
        return parseToGistQueryFilter(filters)
    }, [filters])
}

export const useQueryParamsForModelGist = (): GistParams => {
    const [paginationParams] = usePaginationQueryParams()
    const filterParams = useSectionListQueryFilter()

    return useMemo(() => {
        return {
            ...paginationParams,
            filter: filterParams,
        }
    }, [paginationParams, filterParams])
}
