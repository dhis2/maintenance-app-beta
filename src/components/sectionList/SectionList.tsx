import i18n from '@dhis2/d2-i18n'
import {
    DataTable,
    DataTableColumnHeader,
    DataTableRow,
    TableBody,
    TableHead,
    Checkbox,
} from '@dhis2/ui'
import React, { PropsWithChildren } from 'react'
import { IdentifiableObject } from '../../types/generated'
import { SelectedColumns } from './types'

type SectionListProps<Model extends IdentifiableObject> = {
    headerColumns: SelectedColumns<Model>
}

export const SectionList = <Model extends IdentifiableObject>({
    headerColumns,
    children,
}: PropsWithChildren<SectionListProps<Model>>) => {
    return (
        <DataTable>
            <TableHead>
                <DataTableRow>
                    <DataTableColumnHeader width="48px">
                        <Checkbox />
                    </DataTableColumnHeader>
                    {headerColumns.map((headerColumn) => (
                        <DataTableColumnHeader
                            key={headerColumn.modelPropertyName}
                        >
                            {headerColumn.label}
                        </DataTableColumnHeader>
                    ))}
                    <DataTableColumnHeader>
                        {i18n.t('Actions')}
                    </DataTableColumnHeader>
                </DataTableRow>
            </TableHead>
            <TableBody>{children}</TableBody>
        </DataTable>
    )
}
