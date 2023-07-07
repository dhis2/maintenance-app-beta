import { useCallback, useMemo } from 'react'
import {
    useQueryParam,
    NumericObjectParam,
    withDefault,
} from 'use-query-params'
import { GistPaginator } from '../../../lib/'
import { GistCollectionResponse } from '../../../types/generated'

type PaginationQueryParams = {
    page: number
    pageSize: number
}

const defaultPaginationQueryParams = {
    page: 1,
    pageSize: 20,
}

const PAGE_SIZES = [5, 10, 20, 30, 40, 50, 75, 100]

const paginationQueryParams = withDefault(
    NumericObjectParam,
    defaultPaginationQueryParams
)

export const usePaginationQueryParams = () => {
    const [params, setParams] = useQueryParam('pager', paginationQueryParams, {
        removeDefaultsFromUrl: true,
    })

    return useMemo(
        () => [validatePagerParams(params), setParams] as const,
        [params, setParams]
    )
}

const validatePagerParams = (
    params: typeof paginationQueryParams.default
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

    const validatedPageSize = PAGE_SIZES.reduce((prev, curr) =>
        Math.abs(curr - pageSize) < Math.abs(prev - pageSize) ? curr : prev
    )

    return {
        page,
        pageSize: validatedPageSize,
    }
}

export const useUpdatePaginationParams = (
    data?: GistCollectionResponse
): GistPaginator => {
    const pager = data?.pager
    const [, setParams] = usePaginationQueryParams()

    const getNextPage = useCallback(() => {
        if (!pager?.nextPage) {
            return false
        }
        setParams((prevPager) => ({ ...prevPager, page: pager.page + 1 }))
        return true
    }, [pager, setParams])

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
        getNextPage,
        getPrevPage,
        goToPage,
        changePageSize,
        pager,
    }
}
