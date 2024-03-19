import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    IconDelete16,
    MenuItem,
    Modal,
    ModalActions,
    ModalTitle,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { TOOLTIPS } from '../../../lib'
import { TooltipWrapper } from '../../tooltip'

export function DeleteAction({
    deletable,
    modelType,
    onClick,
    onCancel,
}: {
    deletable: boolean
    modelType: string
    onClick: () => void
    onCancel: () => void
}) {
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)

    return (
        <>
            <TooltipWrapper
                condition={!deletable}
                content={TOOLTIPS.noDeleteAccess}
            >
                <MenuItem
                    dense
                    disabled={!deletable}
                    label={i18n.t('Delete')}
                    icon={<IconDelete16 />}
                    onClick={() => setShowConfirmationDialog(true)}
                />
            </TooltipWrapper>

            {showConfirmationDialog && (
                <ConfirmationDialog
                    modelType={modelType}
                    onConfirm={() => {
                        setShowConfirmationDialog(false)
                        onClick()
                    }}
                    onCancel={() => {
                        setShowConfirmationDialog(false)
                        onCancel()
                    }}
                />
            )}
        </>
    )
}

function ConfirmationDialog({
    modelType,
    onCancel,
    onConfirm,
}: {
    modelType: string
    onCancel: () => void
    onConfirm: () => void
}) {
    return (
        <Modal>
            <ModalTitle>
                {i18n.t(
                    'Are you sure that you want to delete this {{modelType}}?',
                    {
                        modelType: modelType,
                    }
                )}
            </ModalTitle>

            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onCancel}>No</Button>
                    <Button destructive onClick={onConfirm}>
                        Yes
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
