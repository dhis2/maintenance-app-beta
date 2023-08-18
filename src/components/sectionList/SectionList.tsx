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
import { CheckBoxOnChangeObject } from '../../types'
import { IdentifiableObject } from '../../types/generated'
import { SelectedColumns } from './types'

type SectionListProps = {
    headerColumns: SelectedColumns
    onSelectAll: (checked: boolean) => void
    allSelected?: boolean
}

export const SectionList = ({
    allSelected,
    headerColumns,
    children,
    onSelectAll,
}: PropsWithChildren<SectionListProps>) => {
    return (
        <DataTable>
            <TableHead>
                <DataTableRow>
                    <DataTableColumnHeader width="48px">
                        <Checkbox
                            checked={allSelected}
                            onChange={({ checked }: CheckBoxOnChangeObject) =>
                                onSelectAll(checked)
                            }
                        />
                    </DataTableColumnHeader>
                    {headerColumns.length > 0 && (
                        <HeaderColumns headerColumns={headerColumns} />
                    )}
                </DataTableRow>
            </TableHead>
            <TableBody>{children}</TableBody>
        </DataTable>
    )
}

const HeaderColumns = ({
    headerColumns,
}: {
    headerColumns: SelectedColumns
}) => (
    <>
        {headerColumns.map((headerColumn) => (
            <DataTableColumnHeader key={headerColumn.modelPropertyName}>
                {headerColumn.label}
            </DataTableColumnHeader>
        ))}
        <DataTableColumnHeader>{i18n.t('Actions')}</DataTableColumnHeader>
    </>
)
