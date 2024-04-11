import { DataTableColumnHeader, DataTableColumnHeaderProps } from '@dhis2/ui'
import React, { useCallback } from 'react'
import {
    SchemaSection,
    isValidSortPathForSchema,
    useSchema,
    useSectionListSortOrder,
    getTranslatedProperty,
} from '../../lib'
import { SelectedColumn, SelectedColumns } from './types'

type OnSortIconClickCallback = NonNullable<
    DataTableColumnHeaderProps['onSortIconClick']
>

type HeaderColumnsProps = {
    section: SchemaSection
    headerColumns: SelectedColumns
}

export const HeaderColumnsSortable = ({
    section,
    headerColumns,
}: HeaderColumnsProps) => {
    const [sortOrder, setSortOrder] = useSectionListSortOrder()
    const schema = useSchema(section.name)

    const handleSortOrderChange = useCallback<OnSortIconClickCallback>(
        ({ name, direction }) => {
            if (name === undefined) {
                return
            }
            if (direction === 'default') {
                return setSortOrder(undefined)
            }
            setSortOrder([name, direction])
        },
        [setSortOrder]
    )

    const getDataTableSortDirection = (column: SelectedColumn) => {
        const allowSort = column && isValidSortPathForSchema(schema, column)

        if (!allowSort) {
            return undefined
        }
        if (!sortOrder) {
            return 'default'
        }
        const [sortedColumn, sortedDirection] = sortOrder
        const columnIsSorted = sortedColumn === column
        return columnIsSorted ? sortedDirection : 'default'
    }

    return (
        <>
            {headerColumns.map((headerColumn) => (
                <DataTableColumnHeader
                    sortDirection={getDataTableSortDirection(headerColumn)}
                    onSortIconClick={handleSortOrderChange}
                    key={headerColumn}
                    name={headerColumn}
                >
                    {getTranslatedProperty(headerColumn)}
                </DataTableColumnHeader>
            ))}
        </>
    )
}
