import { useCallback, useMemo } from 'react'
import {
    useQueryParam,
    NumericObjectParam,
    withDefault,
} from 'use-query-params'
import type { Pager } from '../../types/generated'

export type PaginationQueryParams = {
    page: number
    pageSize: number
}

const defaultPaginationQueryParams = {
    page: 1,
    pageSize: 20,
}

export const PAGE_SIZES = [5, 10, 20, 30, 40, 50, 75, 100]

const paginationQueryParamsConfig = withDefault(
    NumericObjectParam,
    defaultPaginationQueryParams
)

const validatePagerParams = (
    params: typeof paginationQueryParamsConfig.default
): PaginationQueryParams => {
    if (!params) {
        return defaultPaginationQueryParams
    }
    const isValid = Object.values(params).every(
        (value) => value && !isNaN(value)
    )
    if (!isValid) {
        return defaultPaginationQueryParams
    }

    const pageSize = params.pageSize as number
    const page = params.page as number

    // since pageSize can be changed in URL, find the closest valid pageSize
    const validatedPageSize = PAGE_SIZES.reduce((prev, curr) =>
        Math.abs(curr - pageSize) < Math.abs(prev - pageSize) ? curr : prev
    )

    return {
        page,
        pageSize: validatedPageSize,
    }
}

export const usePaginationQueryParams = () => {
    const [params, setParams] = useQueryParam(
        'pager',
        paginationQueryParamsConfig,
        {
            removeDefaultsFromUrl: true,
        }
    )

    return useMemo(
        () => [validatePagerParams(params), setParams] as const,
        [params, setParams]
    )
}

type Paginator = {
    changePageSize: (pageSize: number) => boolean
    getPrevPage: () => boolean
    goToPage: (page: number) => boolean
    pager?: Pager
}

export function useUpdatePaginationParams(pager?: Pager): Paginator {
    const [, setParams] = usePaginationQueryParams()

    const getPrevPage = useCallback(() => {
        if (!pager?.prevPage) {
            return false
        }
        setParams((prevPager) => ({ ...prevPager, page: pager.page - 1 }))
        return true
    }, [pager, setParams])

    const goToPage = useCallback(
        (page: number) => {
            if (!pager?.pageCount || page > pager.pageCount) {
                return false
            }
            setParams((prevPager) => ({ ...prevPager, page }))
            return true
        },
        [pager, setParams]
    )

    const changePageSize = useCallback(
        (pageSize: number) => {
            setParams((prevPager) => ({ ...prevPager, pageSize: pageSize }))
            return true
        },
        [setParams]
    )

    return {
        getPrevPage,
        goToPage,
        changePageSize,
        pager,
    }
}
