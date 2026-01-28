import { DataTableCell, DataTableRow } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import css from '../../components/sectionList/SectionList.module.css'
import {
    SelectedColumn,
    SelectedColumns,
} from '../../components/sectionList/types'
import { LocaleModel } from './List'

export type LocaleListRowProps = {
    modelData: LocaleModel
    selectedColumns: SelectedColumns
    renderActions: (model: LocaleModel) => React.ReactNode
    renderColumnValue: (
        column: SelectedColumn,
        modelData: LocaleModel
    ) => React.ReactNode
    onClick?: (modelData: LocaleModel) => void
    active?: boolean
}

export const LocaleListRow = React.memo(function LocaleListRowProps({
    active,
    selectedColumns,
    modelData,
    onClick,
    renderActions,
    renderColumnValue,
}: LocaleListRowProps) {
    return (
        <DataTableRow
            className={cx(css.listRow, { [css.active]: active })}
            dataTest={`section-list-row`}
        >
            <DataTableCell width="48px" />
            {selectedColumns.map((selectedColumn) => (
                <DataTableCell
                    key={selectedColumn.path}
                    onClick={() => onClick?.(modelData)}
                >
                    {renderColumnValue(selectedColumn, modelData)}
                </DataTableCell>
            ))}
            <DataTableCell>{renderActions(modelData)}</DataTableCell>
        </DataTableRow>
    )
})
