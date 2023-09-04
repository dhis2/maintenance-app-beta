import { DataTableRow, DataTableCell, Checkbox, Button } from '@dhis2/ui'
import { IconEdit24, IconMore24 } from '@dhis2/ui-icons'
import React from 'react'
import { Link } from 'react-router-dom'
import { CheckBoxOnChangeObject } from '../../types'
import { IdentifiableObject, GistModel } from '../../types/models'
import css from './SectionList.module.css'
import { SelectedColumns, SelectedColumn } from './types'

export type SectionListRowProps<Model extends IdentifiableObject> = {
    modelData: GistModel<Model>
    selectedColumns: SelectedColumns<Model>
    onSelect: (modelId: string, checked: boolean) => void
    selected: boolean
    renderValue: (
        column: SelectedColumn<Model>['modelPropertyName'],
        value: GistModel<Model>[typeof column]
    ) => React.ReactNode
}

export function SectionListRow<Model extends IdentifiableObject>({
    selectedColumns,
    modelData,
    onSelect,
    selected,
    renderValue,
}: SectionListRowProps<Model>) {
    return (
        <DataTableRow
            className={css.listRow}
            dataTest={`section-list-row-${modelData.id}`}
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
            {selectedColumns.map(({ modelPropertyName }) => (
                <DataTableCell key={modelPropertyName}>
                    {modelData[modelPropertyName] &&
                        renderValue(
                            modelPropertyName,
                            modelData[modelPropertyName]
                        )}
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
