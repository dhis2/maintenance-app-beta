import i18n from '@dhis2/d2-i18n'
import { Button, DataTableToolbar } from '@dhis2/ui'
import React from 'react'
import { useSchemaFromHandle } from '../../../lib'
import { BulkSharingDialog } from '../bulk/BulkSharingDialog'
import css from './Toolbar.module.css'

type ToolbarSelectedProps = {
    selectedModels: Set<string>
    onDeselectAll: () => void
    downloadButtonElement: JSX.Element
}

export const ToolbarSelected = ({
    selectedModels,
    onDeselectAll,
    downloadButtonElement,
}: ToolbarSelectedProps) => {
    const [sharingDialogOpen, setSharingDialogOpen] = React.useState(false)
    const sharable = useSchemaFromHandle().shareable

    const handleClose = () => setSharingDialogOpen(false)
    return (
        <DataTableToolbar className={css.listHeaderBulk}>
            <span>
                {i18n.t('{{number}} selected', { number: selectedModels.size })}
            </span>
            {sharable && (
                <Button small onClick={() => setSharingDialogOpen(true)}>
                    {i18n.t('Update sharing')}
                </Button>
            )}
            {downloadButtonElement}
            <Button small onClick={() => onDeselectAll()}>
                {i18n.t('Deselect all')}
            </Button>
            {sharingDialogOpen && (
                <BulkSharingDialog
                    onClose={handleClose}
                    selectedModels={selectedModels}
                />
            )}
        </DataTableToolbar>
    )
}