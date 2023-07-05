import { Pagination, DataTableRow, DataTableCell } from '@dhis2/ui'
import React, { useEffect } from 'react'
import {
    useQueryParam,
    NumericObjectParam,
    withDefault,
} from 'use-query-params'
import { GistPaginator } from '../../lib/'

type SectionListPaginationProps = {
    pagination: GistPaginator
}

const defaultPaginationQueryParams = {
    page: 1,
    pageSize: 10,
}

const paginationQueryParams = withDefault(
    NumericObjectParam,
    defaultPaginationQueryParams
)

export const usePaginiationQueryParams = () => {
    // typeof paginationQueryParams.default => {
    const [params, setParams] = useQueryParam('pager', paginationQueryParams, {
        removeDefaultsFromUrl: true,
    })

    return [validatePagerParams(params), setParams] as const
}

const validatePagerParams = (params: typeof paginationQueryParams.default) => {
    if (!params) {
        return defaultPaginationQueryParams
    }
    const isValid = Object.values(params).every(
        (value) => value && !isNaN(value)
    )

    return isValid ? params : defaultPaginationQueryParams
}

export const SectionListPagination = ({
    pagination,
}: SectionListPaginationProps) => {
    const [paginationParams, setPaginationParams] = usePaginiationQueryParams()

    useEffect(() => {
        if (!pagination.pager) {
            return
        }
        setPaginationParams({
            page: pagination.pager?.page,
            pageSize: pagination.pager?.pageSize,
        })
    }, [pagination, setPaginationParams])

    return (
        <DataTableRow>
            <DataTableCell colSpan="100%">
                <Pagination
                    page={paginationParams.page}
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
