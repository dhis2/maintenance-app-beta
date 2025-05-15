import { DataTableRow, DataTableCell, Checkbox } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import { BaseListModel, TOOLTIPS } from '../../lib'
import { canEditModel } from '../../lib/models/access'
import { CheckBoxOnChangeObject } from '../../types'
import { TooltipWrapper } from '../tooltip'
import css from './SectionList.module.css'
import { SelectedColumns, SelectedColumn } from './types'

export type SectionListRowProps<Model extends BaseListModel> = {
    modelData: Model
    selectedColumns: SelectedColumns
    onSelect: (modelId: string, checked: boolean) => void
    selected: boolean
    renderActions: (model: Model) => React.ReactNode
    renderColumnValue: (
        column: SelectedColumn,
        modelData: Model
    ) => React.ReactNode
    onClick?: (modelData: Model) => void
    active?: boolean
}

export const SectionListRow = React.memo(function SectionListRow<
    Model extends BaseListModel
>({
    active,
    selectedColumns,
    modelData,
    onSelect,
    onClick,
    selected,
    renderActions,
    renderColumnValue,
}: SectionListRowProps<Model>) {
    const editAccess = canEditModel(modelData)
    return (
        <DataTableRow
            className={cx(css.listRow, { [css.active]: active })}
            dataTest={`section-list-row`}
            selected={selected}
        >
            <DataTableCell width="48px">
                <TooltipWrapper
                    condition={!editAccess}
                    content={TOOLTIPS.noEditAccess}
                >
                    <Checkbox
                        disabled={!editAccess}
                        dataTest="section-list-row-checkbox"
                        checked={selected}
                        onChange={({ checked }: CheckBoxOnChangeObject) => {
                            onSelect(modelData.id, checked)
                        }}
                    />
                </TooltipWrapper>
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

export const MemoedSectionListRow = React.memo(
    SectionListRow
) as typeof SectionListRow
