import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    CircularLoader,
    IconDelete16,
    MenuItem,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    NoticeBox,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { useSchemaFromHandle, useDeleteModelMutation } from '../../../lib'
import classes from './DeleteAction.module.css'

export function DeleteAction({
    disabled,
    modelId,
    modelDisplayName,
    modelType,
    onCancel,
    onDeleteSuccess,
}: {
    disabled: boolean
    modelId: string
    modelDisplayName: string
    modelType: string
    onCancel: () => void
    onDeleteSuccess: () => void
}) {
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
    const deleteAndClose = () => {
        setShowConfirmationDialog(false)
        onDeleteSuccess()
    }
    const closeAndCancel = () => {
        setShowConfirmationDialog(false)
        onCancel()
    }

    return (
        <>
            <MenuItem
                dense
                disabled={disabled}
                label={i18n.t('Delete')}
                icon={<IconDelete16 />}
                onClick={() => setShowConfirmationDialog(true)}
            />

            {showConfirmationDialog && (
                <ConfirmationDialog
                    modelDisplayName={modelDisplayName}
                    modelId={modelId}
                    modelType={modelType}
                    onDeleteSuccess={deleteAndClose}
                    onCancel={closeAndCancel}
                />
            )}
        </>
    )
}

function ConfirmationDialog({
    modelId,
    modelDisplayName,
    modelType,
    onCancel,
    onDeleteSuccess,
}: {
    modelId: string
    modelDisplayName: string
    modelType: string
    onCancel: () => void
    onDeleteSuccess: () => void
}) {
    const schema = useSchemaFromHandle()
    const deleteModelMutation = useDeleteModelMutation(schema, {
        onSuccess: () => {
            showDeletionSuccess()
            onDeleteSuccess()
        },
    })

    const { show: showDeletionSuccess } = useAlert(
        () =>
            i18n.t('Successfully deleted {{modelType}} "{{displayName}}"', {
                displayName: modelDisplayName,
                modelType,
            }),
        { success: true }
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorReports = (deleteModelMutation.error as any)?.details?.response
        ?.errorReports

    return (
        <Modal>
            <ModalTitle>
                {i18n.t(
                    'Are you sure that you want to delete this {{modelType}}?',
                    { modelType }
                )}
            </ModalTitle>

            {!!deleteModelMutation.error && (
                <ModalContent>
                    <NoticeBox
                        error
                        title={i18n.t(
                            'Something went wrong deleting the {{modelType}}',
                            { modelType }
                        )}
                    >
                        <div>
                            {i18n.t(
                                'Failed to delete {{modelType}} "{{modelDisplayName}}"! {{messages}}',
                                { modelDisplayName, modelType }
                            )}
                        </div>

                        {!!errorReports?.length && (
                            <ul>
                                {errorReports.map(
                                    // @TODO: I have no idea why TS says "message" isn't being used?
                                    // eslint-disable-next-line react/no-unused-prop-types
                                    ({ message }: { message: string }) => (
                                        <li key={message}>{message}</li>
                                    )
                                )}
                            </ul>
                        )}
                    </NoticeBox>
                </ModalContent>
            )}

            <ModalActions>
                <ButtonStrip>
                    <Button
                        disabled={deleteModelMutation.isLoading}
                        destructive
                        onClick={() =>
                            deleteModelMutation.mutate({
                                id: modelId,
                                displayName: modelDisplayName,
                            })
                        }
                    >
                        {deleteModelMutation.isLoading && (
                            <span className={classes.deleteButtonLoadingIcon}>
                                <CircularLoader extrasmall />
                            </span>
                        )}

                        {deleteModelMutation.isError
                            ? i18n.t('Try again')
                            : i18n.t('Confirm deletion')}
                    </Button>
                    <Button onClick={onCancel}>{i18n.t('No')}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
