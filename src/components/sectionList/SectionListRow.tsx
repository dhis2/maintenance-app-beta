import { DataTableRow, DataTableCell, Checkbox } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import { BaseListModel } from '../../lib'
import { canEditModel } from '../../lib/models/access'
import { CheckBoxOnChangeObject } from '../../types'
import { WrapWithTooltip } from '../tooltip'
import css from './SectionList.module.css'
import { SelectedColumns, SelectedColumn } from './types'

export type SectionListRowProps<Model extends BaseListModel> = {
    modelData: Model
    selectedColumns: SelectedColumns
    onSelect: (modelId: string, checked: boolean) => void
    selected: boolean
    renderActions: (modelId: string) => React.ReactNode
    renderColumnValue: (column: SelectedColumn) => React.ReactNode
    onClick?: (modelData: Model) => void
    active?: boolean
}

export function SectionListRow<Model extends BaseListModel>({
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
            dataTest={`section-list-row-${modelData.id}`}
            selected={selected}
        >
            <DataTableCell width="48px">
                <WrapWithTooltip
                    condition={!editAccess}
                    content={WrapWithTooltip.TOOLTIPS.noEditAccess}
                >
                    <Checkbox
                        disabled={!editAccess}
                        dataTest="section-list-row-checkbox"
                        checked={selected}
                        onChange={({ checked }: CheckBoxOnChangeObject) => {
                            onSelect(modelData.id, checked)
                        }}
                    />
                </WrapWithTooltip>
            </DataTableCell>
            {selectedColumns.map((selectedColumn) => (
                <DataTableCell
                    key={selectedColumn.path}
                    onClick={() => onClick?.(modelData)}
                >
                    {renderColumnValue(selectedColumn)}
                </DataTableCell>
            ))}
            <DataTableCell>{renderActions(modelData.id)}</DataTableCell>
        </DataTableRow>
    )
}
