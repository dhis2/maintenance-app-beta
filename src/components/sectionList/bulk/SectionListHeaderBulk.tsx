import i18n from '@dhis2/d2-i18n'
import { Button, DataTableToolbar } from '@dhis2/ui'
import React from 'react'
import { useSchemaFromHandle } from '../../../lib'
import { BulkSharingDialog } from './BulkSharingDialog'
import css from './SectionListHeaderBulk.module.css'

type SectionListHeaderBulkProps = {
    selectedModels: Set<string>
    onDeselectAll: () => void
}

export const SectionListHeaderBulk = ({
    selectedModels,
    onDeselectAll,
}: SectionListHeaderBulkProps) => {
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
