import { Button, ButtonStrip, Modal, ModalActions } from '@dhis2/ui'
import React from 'react'
import { LinkButton } from '../../LinkButton'
import { DownloadDialogContent } from './DownloadDialogContent'
import { DownloadFormWrapper } from './DownloadForm'
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
            <DownloadFormWrapper>
                <DownloadDialogContent selectedModels={selectedModels} />
                <Actions onClose={onClose} selectedModels={selectedModels} />
            </DownloadFormWrapper>
        </Modal>
    )
}

const Actions = ({ onClose, selectedModels }: DownloadDialogProps) => {
    const downloadUrl = useDownloadUrl({ selectedModels })
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
