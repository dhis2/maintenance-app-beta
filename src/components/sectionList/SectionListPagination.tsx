import { Pagination, DataTableRow, DataTableCell } from '@dhis2/ui'
import React, { useEffect, useCallback, useMemo } from 'react'
import {
    useQueryParam,
    NumericObjectParam,
    withDefault,
} from 'use-query-params'
import { Pager } from '../../types/generated'

type SectionListPaginationProps = {
    pager: Pager | undefined
}

export type PaginationQueryParams = {
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

    // since pageSize can be changed in URL, find the closest valid pageSize
    const validatedPageSize = PAGE_SIZES.reduce((prev, curr) =>
        Math.abs(curr - pageSize) < Math.abs(prev - pageSize) ? curr : prev
    )

    return {
        page,
        pageSize: validatedPageSize,
    }
}

type Paginator = {
    changePageSize: (pageSize: number) => boolean
    getPrevPage: () => boolean
    goToPage: (page: number) => boolean
    pager?: Pager
}

function useUpdatePaginationParams(pager?: Pager): Paginator {
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

/** clamps a number between min and max,
 *resulting in a number between min and max (inclusive).
 */
const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(value, max))

export const SectionListPagination = ({
    pager,
}: SectionListPaginationProps) => {
    const [paginationParams] = usePaginationQueryParams()
    const pagination = useUpdatePaginationParams(pager)

    useEffect(() => {
        // since page can be controlled by params
        // do a refetch if page is out of bounds
        const page = paginationParams.page

        const clamped = clamp(page, 1, pagination.pager?.pageCount || 1)
        if (page !== clamped) {
            pagination.goToPage(clamped)
        }
    }, [pagination, paginationParams.page])

    if (!pagination.pager?.total) {
        return null
    }

    // Prevent out of bounds for page-selector
    // note that this will make the UI-selector out of sync with the actual data
    // but paginator throws error if page is out of bounds
    // useEffect above will refetch last page - so this should only be for a very brief render
    const page = clamp(
        paginationParams.page,
        1,
        pagination.pager?.pageCount || 1
    )

    return (
        <DataTableRow dataTest="section-list-pagination">
            <DataTableCell colSpan="100%">
                <Pagination
                    pageSizes={PAGE_SIZES.map((s) => s.toString())}
                    page={page}
                    pageSize={paginationParams.pageSize}
                    pageCount={pagination.pager?.pageCount}
                    total={pagination.pager?.total}
                    onPageSizeChange={pagination.changePageSize}
                    onPageChange={pagination.goToPage}
                />
            </DataTableCell>
        </DataTableRow>
    )
}
