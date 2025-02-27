import i18n from '@dhis2/d2-i18n'
import { Button, DataTableToolbar } from '@dhis2/ui'
import React from 'react'
import {
    useCanMergeModelInCurrentSection,
    useLocationState,
    useSchemaFromHandle,
} from '../../../lib'
import { LinkButton } from '../../LinkButton'
import { BulkSharingDialog } from '../bulk/BulkSharingDialog'
import css from './Toolbar.module.css'

type ToolbarSelectedProps = {
    selectedModels: Set<string>
    onDeselectAll: () => void
    downloadButtonElement: JSX.Element | null
}

export const ToolbarSelected = ({
    selectedModels,
    onDeselectAll,
    downloadButtonElement,
}: ToolbarSelectedProps) => {
    const [sharingDialogOpen, setSharingDialogOpen] = React.useState(false)
    const sharable = useSchemaFromHandle().shareable
    const mergeable = useCanMergeModelInCurrentSection()
    const handleClose = () => setSharingDialogOpen(false)
    const searchStateWithSelectedModels = useLocationState({
        selectedModels,
    })

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
            {mergeable && (
                <LinkButton
                    small
                    to={'merge'}
                    state={searchStateWithSelectedModels}
                >
                    {i18n.t('Merge...')}
                </LinkButton>
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
