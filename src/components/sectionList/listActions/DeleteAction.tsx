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
import {
    BaseListModel,
    useDeleteModelMutation,
    useSchemaFromHandle,
    useSchemaSectionHandleOrThrow,
} from '../../../lib'
import classes from './DeleteAction.module.css'

export function DeleteAction({
    disabled,
    model,
    onCancel,
    onDeleteSuccess,
}: {
    disabled: boolean
    model: BaseListModel
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
                destructive
                disabled={disabled}
                label={i18n.t('Delete')}
                icon={<IconDelete16 />}
                onClick={() => setShowConfirmationDialog(true)}
            />

            {showConfirmationDialog && (
                <ConfirmationDialog
                    model={model}
                    onDeleteSuccess={deleteAndClose}
                    onCancel={closeAndCancel}
                />
            )}
        </>
    )
}

function ConfirmationDialog({
    model,
    onCancel,
    onDeleteSuccess,
}: {
    model: BaseListModel
    onCancel: () => void
    onDeleteSuccess: () => void
}) {
    const section = useSchemaFromHandle()

    if (!section) {
        throw new Error('DeleteAction used outside a schema section')
    }
    const resource = section.plural

    const { show: showDeletionSuccess } = useAlert(
        () =>
            i18n.t('Successfully deleted {{modelType}} "{{displayName}}"', {
                displayName: model.displayName,
                modelType: section.name,
            }),
        { success: true }
    )

    const deleteModelMutation = useDeleteModelMutation(resource, {
        onSuccess: () => {
            showDeletionSuccess()
            onDeleteSuccess()
        },
    })

    const errorReports =
        deleteModelMutation.error?.details?.response?.errorReports

    return (
        <Modal dataTest="delete-confirmation-modal">
            <ModalTitle>
                {i18n.t(
                    'Are you sure that you want to delete this {{modelType}}?',
                    { modelType: section.name }
                )}
            </ModalTitle>

            {!!deleteModelMutation.error && (
                <ModalContent>
                    <NoticeBox
                        error
                        title={i18n.t(
                            'Something went wrong deleting the {{modelType}}',
                            { modelType: section.name }
                        )}
                    >
                        <div>
                            {i18n.t(
                                'Failed to delete {{modelType}} "{{displayName}}"! {{messages}}',
                                {
                                    displayName: model.displayName,
                                    modelType: section.name,
                                }
                            )}
                        </div>

                        {!!errorReports?.length && (
                            <ul>
                                {errorReports.map(({ message }) => (
                                    <li key={message}>{message}</li>
                                ))}
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
                                id: model.id,
                                displayName: model.displayName,
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

                    <Button
                        disabled={deleteModelMutation.isLoading}
                        onClick={onCancel}
                    >
                        {i18n.t('Cancel')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
