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
    unconfirmedSelectionLabel,
    modalTitle,
    modalMessage,
    objectName,
    children,
}: {
    onClose: () => void
    confirmSelection: () => void
    unconfirmedSelectionLabel: string | null
    modalTitle?: string
    modalMessage?: string
    objectName?: string
    children?: React.ReactNode
}) => (
    <>
        {unconfirmedSelectionLabel && (
            <Modal onClose={onClose} position="middle">
                <ModalTitle>
                    {modalTitle || i18n.t('Change this field')}
                </ModalTitle>
                <ModalContent>
                    {modalMessage && <p>{modalMessage}</p>}

                    <p>
                        {i18n.t(
                            'Are you sure you want to change {{objectName}} to {{- unconfirmedSelectionLabel}}?',
                            {
                                unconfirmedSelectionLabel:
                                    unconfirmedSelectionLabel,
                                objectName:
                                    objectName || i18n.t('this element'),
                            }
                        )}
                    </p>
                </ModalContent>
                <ModalActions>
                    <ButtonStrip>
                        <Button onClick={onClose}>{i18n.t('Cancel')}</Button>
                        <Button destructive onClick={confirmSelection}>
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
    mapUnconfirmedSelection,
    modalTitle,
    modalMessage,
    objectName,
}: {
    onChange: (event: any) => void
    renderComponent: (onChange: any) => React.JSX.Element
    mapUnconfirmedSelection?: (selection: any) => string
    modalTitle?: string
    modalMessage?: string
    objectName?: string
}) => {
    const id = useParams()?.id
    const isEdit = !!id
    const [unconfirmedSelection, setUnconfirmedSelection] = useState<any>(null)
    return (
        <ConfirmationModal
            onClose={() => {
                setUnconfirmedSelection(null)
            }}
            confirmSelection={() => {
                onChange(unconfirmedSelection)
                setUnconfirmedSelection(null)
            }}
            unconfirmedSelectionLabel={
                mapUnconfirmedSelection
                    ? mapUnconfirmedSelection(unconfirmedSelection)
                    : unconfirmedSelection
            }
            modalTitle={modalTitle}
            modalMessage={modalMessage}
            objectName={objectName}
        >
            {renderComponent({
                onChange: !isEdit ? onChange : setUnconfirmedSelection,
            })}
        </ConfirmationModal>
    )
}
