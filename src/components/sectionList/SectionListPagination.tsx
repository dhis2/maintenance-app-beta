import { Pagination, DataTableRow, DataTableCell } from '@dhis2/ui'
import React, { useEffect } from 'react'
import {
    usePaginationQueryParams,
    useUpdatePaginationParams,
    PAGE_SIZES,
} from '../../lib'
import type { Pager } from '../../types/generated'
/** clamps a number between min and max,
 *resulting in a number between min and max (inclusive).
 */
const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(value, max))

type SectionListPaginationProps = {
    pager: Pager | undefined
}

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
                    dataTest="section-list-pagination-actions"
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
