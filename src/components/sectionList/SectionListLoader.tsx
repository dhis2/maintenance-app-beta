import { DataTableRow, DataTableCell } from '@dhis2/ui'
import React from 'react'
import { LoadingSpinner } from '../loading/LoadingSpinner'

export const SectionListLoader = () => {
    return (
        <DataTableRow>
            <DataTableCell colSpan="100%">
                <LoadingSpinner />
            </DataTableCell>
        </DataTableRow>
    )
}
