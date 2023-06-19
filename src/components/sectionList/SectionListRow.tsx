import { DataTableRow, DataTableCell, Checkbox, Button } from '@dhis2/ui'
import { IconEdit24, IconMore24 } from '@dhis2/ui-icons'
import React from 'react'
import { Link } from 'react-router-dom'
import { IdentifiableObject } from '../../types/generated'
import css from './SectionList.module.css'
import { SelectedColumns } from './types'

export type SectionListRowProps<Model extends IdentifiableObject> = {
    modelData: Model
    selectedColumns: SelectedColumns<Model>
}

export function SectionListRow<Model extends IdentifiableObject>({
    selectedColumns,
    modelData,
}: SectionListRowProps<Model>) {
    return (
        <DataTableRow className={css.listRow}>
            <DataTableCell width="48px">
                <Checkbox value="false" />
            </DataTableCell>
            {selectedColumns.map(({ modelPropertyName }) => (
                <DataTableCell key={modelPropertyName}>
                    {/* TODO: Handle constant translations and resolve displayvalues to components */}
                    {typeof modelData[modelPropertyName] === 'object'
                        ? modelPropertyName
                        : modelData[modelPropertyName]}
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
