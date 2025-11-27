import { Checkbox, DataTableCell, DataTableRow } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import css from '../../components/sectionList/SectionList.module.css'
import {
    SelectedColumn,
    SelectedColumns,
} from '../../components/sectionList/types'
import { CheckBoxOnChangeObject } from '../../types'
import { LocaleModel } from './List'

export type LocaleListRowProps = {
    modelData: LocaleModel
    selectedColumns: SelectedColumns
    onSelect: (modelId: string, checked: boolean) => void
    selected: boolean
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
    onSelect,
    onClick,
    selected,
    renderActions,
    renderColumnValue,
}: LocaleListRowProps) {
    return (
        <DataTableRow
            className={cx(css.listRow, { [css.active]: active })}
            dataTest={`section-list-row`}
            selected={selected}
        >
            <DataTableCell width="48px">
                <Checkbox
                    disabled={false}
                    dataTest="section-list-row-checkbox"
                    checked={selected}
                    onChange={({ checked }: CheckBoxOnChangeObject) => {
                        onSelect(modelData.id, checked)
                    }}
                />
            </DataTableCell>
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
