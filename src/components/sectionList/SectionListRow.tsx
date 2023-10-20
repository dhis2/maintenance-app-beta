import { DataTableRow, DataTableCell, Checkbox, Button } from '@dhis2/ui'
import { IconEdit24, IconMore24 } from '@dhis2/ui-icons'
import cx from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'
import { CheckBoxOnChangeObject } from '../../types'
import { IdentifiableObject, GistModel } from '../../types/models'
import css from './SectionList.module.css'
import { SelectedColumns, SelectedColumn } from './types'

export type SectionListRowProps<Model extends IdentifiableObject> = {
    modelData: GistModel<Model> | Model
    selectedColumns: SelectedColumns
    onSelect: (modelId: string, checked: boolean) => void
    selected: boolean
    renderColumnValue: (column: SelectedColumn) => React.ReactNode
    onClick?: (modelData: GistModel<Model> | Model) => void
    active?: boolean
}

export function SectionListRow<Model extends IdentifiableObject>({
    active,
    selectedColumns,
    modelData,
    onSelect,
    onClick,
    selected,
    renderColumnValue,
}: SectionListRowProps<Model>) {
    return (
        <DataTableRow
            className={cx(css.listRow, { [css.active]: active })}
            dataTest={`section-list-row-${modelData.id}`}
            selected={selected}
        >
            <DataTableCell width="48px">
                <Checkbox
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
                    {renderColumnValue(selectedColumn)}
                </DataTableCell>
            ))}
            <DataTableCell>
                <ListActions modelId={modelData.id} />
            </DataTableCell>
        </DataTableRow>
    )
}

const ListActions = ({ modelId }: { modelId: string }) => {
    return (
        <div className={css.listActions}>
            <ActionEdit modelId={modelId} />
            <ActionMore />
        </div>
    )
}

const ActionEdit = ({ modelId }: { modelId: string }) => {
    return (
        <Link to={`${modelId}`}>
            <Button small secondary>
                <IconEdit24 />
            </Button>
        </Link>
    )
}

const ActionMore = () => {
    return (
        <Button small secondary>
            <IconMore24 />
        </Button>
    )
}
