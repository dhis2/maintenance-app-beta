import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React, { useState } from 'react'
import { DownloadDialog } from '../download'
import { ToolbarNormal } from './ToolbarNormal'
import { ToolbarSelected } from './ToolbarSelected'

type ToolbarProps = {
    selectedModels: Set<string>
    onDeselectAll: () => void
    downloadable?: boolean
}

const DownloadButton = ({ onClick }: { onClick: () => void }) => (
    <Button small onClick={onClick}>
        {i18n.t('Download')}
    </Button>
)

export const Toolbar = ({
    selectedModels,
    onDeselectAll,
    downloadable = true,
}: ToolbarProps) => {
    const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)

    const isAnySelected = selectedModels.size > 0

    const DownloadButtonElement = downloadable ? (
        <DownloadButton onClick={() => setDownloadDialogOpen(true)} />
    ) : undefined

    return (
        <>
            {isAnySelected ? (
                <ToolbarSelected
                    selectedModels={selectedModels}
                    onDeselectAll={onDeselectAll}
                    downloadButtonElement={DownloadButtonElement}
                />
            ) : (
                <ToolbarNormal downloadButtonElement={DownloadButtonElement} />
            )}
            {downloadDialogOpen && (
                <DownloadDialog
                    onClose={() => setDownloadDialogOpen(false)}
                    selectedModels={selectedModels}
                />
            )}
        </>
    )
}
