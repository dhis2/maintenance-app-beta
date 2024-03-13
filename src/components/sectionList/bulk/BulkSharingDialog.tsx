import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import React from 'react'
import { BulkSharing } from './BulkSharing'

type BulkSharingDialogProps = {
    onClose: () => void
    selectedModels: Set<string>
}

export const BulkSharingDialog = ({
    onClose,
    selectedModels,
}: BulkSharingDialogProps) => {
    return (
        <Modal onClose={onClose} large={true}>
            <ModalTitle>
                {i18n.t('Update sharing for {{number}} items', {
                    number: selectedModels.size,
                })}
            </ModalTitle>
            <ModalContent>
                <BulkSharing onSaved={onClose} selectedModels={selectedModels}>
                    {({ submitting, disableSave }) => (
                        <ModalActions>
                            <ButtonStrip>
                                <Button onClick={onClose} secondary>
                                    {i18n.t('Cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    primary
                                    loading={submitting}
                                    disabled={disableSave}
                                >
                                    {i18n.t('Update sharing')}
                                </Button>
                            </ButtonStrip>
                        </ModalActions>
                    )}
                </BulkSharing>
            </ModalContent>
        </Modal>
    )
}
