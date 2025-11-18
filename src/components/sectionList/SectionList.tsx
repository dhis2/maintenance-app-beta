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
import { isSchemaSection, useSectionHandle } from '../../lib'
import { CheckBoxOnChangeObject } from '../../types'
import { HeaderColumnsSortable } from './ColumnHeaderSortable'
import css from './SectionList.module.css'
import { SelectedColumns } from './types'

type SectionListProps = {
    headerColumns: SelectedColumns
    onSelectAll?: (checked: boolean) => void
    allSelected?: boolean
}

export const SectionList = ({
    allSelected,
    headerColumns,
    children,
    onSelectAll,
}: PropsWithChildren<SectionListProps>) => {
    console.log('Rendering SectionList', allSelected)
    return (
        <DataTable className={css.list}>
            <TableHead>
                <DataTableRow>
                    <DataTableColumnHeader width={'48px'}>
                        {onSelectAll && (
                            <Checkbox
                                dataTest="section-list-selectall"
                                checked={allSelected}
                                onChange={({
                                    checked,
                                }: CheckBoxOnChangeObject) =>
                                    onSelectAll!(checked)
                                }
                            />
                        )}
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
}) => {
    const section = useSectionHandle()

    // if the section does not have a schema, disable sorting for now
    // sorting needs to check for schema-properties to know what columns are sortable
    return (
        <>
            {section && isSchemaSection(section) ? (
                <HeaderColumnsSortable
                    section={section}
                    headerColumns={headerColumns}
                />
            ) : (
                headerColumns.map((headerColumn) => (
                    <DataTableColumnHeader key={headerColumn.path}>
                        {headerColumn.label}
                    </DataTableColumnHeader>
                ))
            )}
            <DataTableColumnHeader>{i18n.t('Actions')}</DataTableColumnHeader>
        </>
    )
}
