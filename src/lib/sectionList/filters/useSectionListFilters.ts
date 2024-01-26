import { useCallback, useMemo } from 'react'
import { useQueryParams } from 'use-query-params'
import {
    usePaginationQueryParams,
    useUpdatePaginationParams,
} from '../usePaginationParams'
import {
    ParsedFilterParams,
    filterQueryParamType,
    filterParamsSchema,
    validFilterKeys,
} from './filterConfig'

export const useSectionListFilters = () => {
    const [filters, setFilterParams] = useQueryParams(filterQueryParamType)
    const [, setPagingParams] = usePaginationQueryParams()
    console.log({ filters })
    const parsedFilters = useMemo(() => {
        const parsed = filterParamsSchema.safeParse(filters)
        if (parsed.success) {
            return parsed.data
        }
        console.warn('Failed to parse filters', parsed.error)
        return {}
    }, [filters])

    const setFilter = useCallback(
        (
            // allow undefined to reset all filters
            filter: Parameters<typeof setFilterParams>[0] | undefined,
            updateType?: Parameters<typeof setFilterParams>[1]
        ) => {
            if (filter == undefined) {
                const resetParams = Object.fromEntries(
                    validFilterKeys.map((key) => [key, undefined])
                )
                return setFilterParams(resetParams)
            }
            setFilterParams(filter, updateType)
            // set page to 1 when filter changes
            // do this here instead of useEffect to prevent unnecessary refetches
            setPagingParams((pagingParams) => ({ ...pagingParams, page: 1 }))
        },
        [setFilterParams, setPagingParams]
    )

    return [parsedFilters, setFilter] as const
}

export const useSectionListFilter = <TKey extends keyof ParsedFilterParams>(
    filterKey: TKey
) => {
    const [filters, setFilters] = useSectionListFilters()

    const boundSetFilter = useCallback(
        (value: ParsedFilterParams[TKey]) => {
            setFilters((prevFilters) => ({
                ...prevFilters,
                [filterKey]: value,
            }))
        },
        [filterKey, setFilters]
    )
    return [filters?.[filterKey] ?? undefined, boundSetFilter] as const
}
