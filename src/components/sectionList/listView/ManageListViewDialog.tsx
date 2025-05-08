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
        <Modal onClose={onClose} position="top" dataTest="manage-view-modal">
            <ModalTitle>
                {i18n.t('Manage {{section}} view', {
                    section: section.title,
                })}
            </ModalTitle>
            <ModalContent>
                <ManageListView onSaved={onClose}>
                    {({ submitting }) => (
                        <ModalActions>
                            <ButtonStrip>
                                <Button onClick={onClose} secondary>
                                    {i18n.t('Cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    primary
                                    loading={submitting}
                                >
                                    {i18n.t('Update view')}
                                </Button>
                            </ButtonStrip>
                        </ModalActions>
                    )}
                </ManageListView>
            </ModalContent>
        </Modal>
    )
}
