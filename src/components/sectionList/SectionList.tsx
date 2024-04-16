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
import {
    isSchemaSection,
    useSectionHandle,
    getTranslatedProperty,
} from '../../lib'
import { CheckBoxOnChangeObject } from '../../types'
import { HeaderColumnsSortable } from './ColumnHeaderSortable'
import { useModelListView } from './listView'
import css from './SectionList.module.css'
import { SelectedColumns } from './types'

type SectionListProps = {
    onSelectAll: (checked: boolean) => void
    allSelected?: boolean
}

export const SectionList = ({
    allSelected,
    children,
    onSelectAll,
}: PropsWithChildren<SectionListProps>) => {
    const { columns: headerColumns } = useModelListView()

    return (
        <DataTable className={css.list}>
            <TableHead>
                <DataTableRow>
                    <DataTableColumnHeader width={'48px'}>
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
                headerColumns.map((column) => (
                    <DataTableColumnHeader key={column}>
                        {getTranslatedProperty(column)}
                    </DataTableColumnHeader>
                ))
            )}
            <DataTableColumnHeader>{i18n.t('Actions')}</DataTableColumnHeader>
        </>
    )
}
