import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const ConfirmationModal = ({
    onClose,
    confirmSelection,
    unconfirmedSelectionPending,
    modalTitle,
    modalMessage,
    modalMessageSelectionSpecificConfirmation,
    children,
}: {
    onClose: () => void
    confirmSelection: () => void
    unconfirmedSelectionPending: boolean
    modalTitle?: string
    modalMessage?: string
    modalMessageSelectionSpecificConfirmation?: string
    children?: React.ReactNode
}) => (
    <>
        {unconfirmedSelectionPending && (
            <Modal onClose={onClose} position="middle">
                <ModalTitle>
                    {modalTitle || i18n.t('Change this field')}
                </ModalTitle>
                <ModalContent>
                    {modalMessage && <p>{modalMessage}</p>}

                    <p>
                        {modalMessageSelectionSpecificConfirmation ??
                            i18n.t('Are you sure you want to change this?')}
                    </p>
                </ModalContent>
                <ModalActions>
                    <ButtonStrip>
                        <Button
                            dataTest="confirmationModal-cancel"
                            onClick={onClose}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                        <Button
                            dataTest="confirmationModal-confirm"
                            destructive
                            onClick={confirmSelection}
                        >
                            {i18n.t('Yes, change')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
        )}
        {children}
    </>
)

export const ConfirmationModalWrapper = ({
    onChange,
    renderComponent,
    skipConfirmationLogic,
    modalTitle,
    modalMessage,
    modalMessageSelectionSpecificConfirmation,
}: {
    onChange: (event: any) => void
    renderComponent: (onChange: any) => React.JSX.Element
    skipConfirmationLogic?: (selection: any) => boolean
    modalTitle?: string
    modalMessage?: string
    modalMessageSelectionSpecificConfirmation?: (selection: any) => string
}) => {
    const id = useParams()?.id
    const isEdit = !!id
    const [unconfirmedSelection, setUnconfirmedSelection] = useState<any>(null)
    const setUnconfirmedSelectionWithLogic = (selection: any) => {
        if (skipConfirmationLogic?.(selection)) {
            onChange(selection)
        } else {
            setUnconfirmedSelection(selection)
        }
    }
    return (
        <ConfirmationModal
            onClose={() => {
                setUnconfirmedSelection(null)
            }}
            confirmSelection={() => {
                onChange(unconfirmedSelection)
                setUnconfirmedSelection(null)
            }}
            unconfirmedSelectionPending={!!unconfirmedSelection}
            modalTitle={modalTitle}
            modalMessage={modalMessage}
            modalMessageSelectionSpecificConfirmation={
                unconfirmedSelection &&
                modalMessageSelectionSpecificConfirmation
                    ? modalMessageSelectionSpecificConfirmation(
                          unconfirmedSelection
                      )
                    : undefined
            }
        >
            {renderComponent({
                onChange: isEdit ? setUnconfirmedSelectionWithLogic : onChange,
            })}
        </ConfirmationModal>
    )
}
