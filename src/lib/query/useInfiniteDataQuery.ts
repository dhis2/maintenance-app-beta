import { useDataQuery } from '@dhis2/app-runtime'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ResultQuery, WrapQueryResponse } from '../../types'
import { Pager } from '../../types/generated'

type PagerObject = {
    pager: Pager
}

type PagedResponse<TData> = PagerObject & { [key: string]: TData[] }

type InfiniteQueryResult<TData> = WrapQueryResponse<PagedResponse<TData>>

type QueryOptions = Parameters<typeof useDataQuery>[1]
type InfiniteQueryOptions = QueryOptions & {
    dataResultKey?: string
}
export const useInfiniteDataQuery = <TData>(
    query: ResultQuery,
    options?: InfiniteQueryOptions
) => {
    const [allResult, setAllResult] = useState<TData[]>([])

    let queryOptions: QueryOptions = undefined
    let dataKey = query.result.resource
    if (options) {
        const { dataResultKey, ...opts } = options
        dataKey = dataResultKey || query.result.resource
        queryOptions = opts
    }

    const queryResult = useDataQuery<InfiniteQueryResult<TData>>(
        query,
        queryOptions
    )
    const { refetch, data } = queryResult

    const pager = data?.result.pager
    const page = pager?.page || 0
    const pageCount = pager?.pageCount || 0

    useEffect(() => {
        const result = data?.result[dataKey]
        if (result) {
            setAllResult((prev) => {
                const pager = data.result.pager
                if (pager.page === 1) {
                    return data.result[dataKey]
                }
                return [...prev, ...data.result[dataKey]]
            })
        }
    }, [data, dataKey, setAllResult])

    const incrementPage = useCallback(() => {
        refetch({ page: page + 1 })
    }, [refetch, page])

    const newData = useMemo(() => {
        return {
            result: {
                ...data?.result,
                [dataKey]: allResult,
            },
        }
    }, [allResult, data, dataKey])
    return {
        ...queryResult,
        data: newData,
        incrementPage,
        hasNextPage: page < pageCount,
    }
}
