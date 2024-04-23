import { Button, ButtonStrip, Modal, ModalActions } from '@dhis2/ui'
import React from 'react'
import { LinkButton } from '../../LinkButton'
import { DownloadDialogContent } from './DownloadDialogContent'
import { DownloadForm } from './DownloadForm'
import { useDownloadUrl } from './useDownloadUrl'

type DownloadDialogProps = {
    onClose: () => void
    selectedModels: Set<string>
}

export const DownloadDialog = ({
    onClose,
    selectedModels,
}: DownloadDialogProps) => {
    return (
        <Modal onClose={onClose}>
            <DownloadForm>
                <DownloadDialogContent selectedModels={selectedModels} />
                <Actions onClose={onClose} />
            </DownloadForm>
        </Modal>
    )
}

const Actions = ({ onClose }: { onClose: () => void }) => {
    const downloadUrl = useDownloadUrl()
    return (
        <ModalActions>
            <ButtonStrip>
                <Button onClick={onClose} secondary>
                    Cancel
                </Button>
                <LinkButton primary onClick={onClose} href={downloadUrl}>
                    Download
                </LinkButton>
            </ButtonStrip>
        </ModalActions>
    )
}
