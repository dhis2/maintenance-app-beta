import { useDataEngine, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalContent,
    ModalActions,
} from '@dhis2/ui'
import React, { useCallback, useState } from 'react'
import { useField } from 'react-final-form'
import {
    StandardFormSectionTitle,
    DrawerPortal,
} from '../../../../../components'
import { parseErrorResponse } from '../../../../../lib'
import css from './CustomFormContents.module.css'
import { CustomFormEdit } from './CustomFormEdit'

// delete: the id here is the dataEntryForm.id (not the id of the data set)
const useDeleteForm = ({
    id,
    onComplete,
}: {
    id: string
    onComplete: () => void
}) => {
    const dataEngine = useDataEngine()
    const { show: showCustomFormDeleteError } = useAlert(
        (details) =>
            i18n.t('Custom form could not be deleted:{{details}}', {
                details,
                nsSeparator: '~:~',
            }),
        { critical: true }
    )

    const deleteForm = useCallback(async () => {
        try {
            const response = await dataEngine.mutate(
                {
                    resource: `dataEntryForms`,
                    type: 'delete',
                    id,
                },
                {
                    onComplete,
                    onError: (e) => {
                        showCustomFormDeleteError(e.message)
                    },
                }
            )
            return { data: response }
        } catch (error) {
            return { error: parseErrorResponse(error) }
        }
    }, [dataEngine, id, onComplete, showCustomFormDeleteError])
    return deleteForm
}

const DeleteModal = ({
    closeModal,
    deleteCustomForm,
}: {
    closeModal: () => void
    deleteCustomForm: () => void
}) => (
    <Modal position="middle" onClose={closeModal}>
        <ModalContent>
            {i18n.t('Are you sure you want to delete this data entry form?')}
        </ModalContent>
        <ModalActions>
            <ButtonStrip>
                <Button small onClick={closeModal}>
                    {i18n.t('Cancel')}
                </Button>
                <Button small destructive onClick={deleteCustomForm}>
                    {i18n.t('Delete')}
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
)

export const CustomFormEditEntry = () => {
    const [customFormEditOpen, setCustomFormEditOpen] =
        React.useState<boolean>(false)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] =
        useState<boolean>(false)
    const closeDeleteConfirmationModal = useCallback(() => {
        setDeleteConfirmationOpen(false)
    }, [setDeleteConfirmationOpen])
    const { input: formInput } = useField('dataEntryForm')
    const addMode = !formInput?.value?.id // if there is no formId, you need to add a form
    const { input: controlledFormTypeInput } = useField('formType')
    const clearForm = () => {
        formInput.onChange({ ...formInput.value, htmlCode: '', id: null })
        controlledFormTypeInput.onChange('DEFAULT')
    }
    const deleteCustomForm = useDeleteForm({
        id: formInput?.value?.id ?? '',
        onComplete: clearForm,
    })

    return (
        <div className={css.customFormEntry}>
            {deleteConfirmationOpen && (
                <DeleteModal
                    closeModal={closeDeleteConfirmationModal}
                    deleteCustomForm={() => {
                        deleteCustomForm()
                        closeDeleteConfirmationModal()
                    }}
                />
            )}
            <DrawerPortal
                isOpen={customFormEditOpen}
                onClose={() => setCustomFormEditOpen(false)}
            >
                {customFormEditOpen && (
                    <CustomFormEdit
                        closeCustomFormEdit={() => setCustomFormEditOpen(false)}
                    />
                )}
            </DrawerPortal>
            <div>
                <StandardFormSectionTitle>
                    {i18n.t('Custom form')}
                </StandardFormSectionTitle>
                <div className={css.description}>
                    {addMode
                        ? i18n.t(
                              'A custom form must be added for it to be used for data entry (web).'
                          )
                        : i18n.t(
                              'This data set uses a custom form for data entry (web).'
                          )}
                </div>
            </div>
            <div>
                <ButtonStrip>
                    {!addMode && (
                        <Button
                            secondary
                            small
                            destructive
                            onClick={() => setDeleteConfirmationOpen(true)}
                            disabled={!formInput?.value?.id}
                        >
                            {i18n.t('Delete custom form')}
                        </Button>
                    )}
                    <Button
                        secondary
                        small
                        onClick={() => setCustomFormEditOpen(true)}
                    >
                        {addMode
                            ? i18n.t('Create custom form')
                            : i18n.t('Edit custom form')}
                    </Button>
                </ButtonStrip>
            </div>
        </div>
    )
}
