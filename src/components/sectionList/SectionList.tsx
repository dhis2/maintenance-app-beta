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
import css from './SectionList.module.css'
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
        <DataTable className={css.list}>
            <TableHead>
                <DataTableRow>
                    <DataTableColumnHeader width="48px">
                        <Checkbox
                            dataTest="section-list-selectall"
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
            <DataTableColumnHeader key={headerColumn.path}>
                {headerColumn.label}
            </DataTableColumnHeader>
        ))}
        <DataTableColumnHeader>{i18n.t('Actions')}</DataTableColumnHeader>
    </>
)
