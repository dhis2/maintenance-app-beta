import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, Modal, ModalActions } from '@dhis2/ui'
import React from 'react'
import { useModelSectionHandleOrThrow } from '../../../lib'
import { ModelSection } from '../../../types'
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
    const section = useModelSectionHandleOrThrow()

    return (
        <Modal onClose={onClose} dataTest="download-modal">
            <DownloadFormWrapper hasSelected={selectedModels.size > 0}>
                <DownloadDialogContent
                    section={section}
                    selectedModels={selectedModels}
                />
                <Actions
                    onClose={onClose}
                    section={section}
                    selectedModels={selectedModels}
                />
            </DownloadFormWrapper>
        </Modal>
    )
}

type ActionsProps = Pick<DownloadDialogProps, 'onClose' | 'selectedModels'> & {
    section: ModelSection
}
const Actions = ({ onClose, selectedModels, section }: ActionsProps) => {
    const downloadUrl = useDownloadUrl({
        selectedModels,
        modelNamePlural: section.namePlural,
    })

    return (
        <ModalActions>
            <ButtonStrip>
                <Button onClick={onClose} secondary>
                    {i18n.t('Cancel')}
                </Button>
                <LinkButton
                    primary
                    onClick={onClose}
                    href={downloadUrl}
                    download={true}
                >
                    {i18n.t('Download')}
                </LinkButton>
            </ButtonStrip>
        </ModalActions>
    )
}
