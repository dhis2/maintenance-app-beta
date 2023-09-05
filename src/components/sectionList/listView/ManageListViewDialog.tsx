import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    Button,
    ButtonStrip,
} from '@dhis2/ui'
import React from 'react'
import { useModelSectionHandleOrThrow } from '../../../lib'
import { ManageListView } from './ManageListView'

type ManageListViewDialogProps = {
    onClose: () => void
}
export const ManageListViewDialog = ({
    onClose,
}: ManageListViewDialogProps) => {
    const section = useModelSectionHandleOrThrow()

    return (
        <Modal onClose={onClose} position="top">
            <ModalTitle>
                {i18n.t('Manage {{section}} table columns', {
                    section: section.title,
                })}
            </ModalTitle>
            <ModalContent>
                <ManageListView onSaved={onClose}>
                    {({ handleSave, isSaving }) => (
                        <ModalActions>
                            <ButtonStrip>
                                <Button onClick={onClose} secondary>
                                    {i18n.t('Cancel')}
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    primary
                                    loading={isSaving}
                                >
                                    {i18n.t('Update table columns')}
                                </Button>
                            </ButtonStrip>
                        </ModalActions>
                    )}
                </ManageListView>
            </ModalContent>
        </Modal>
    )
}
