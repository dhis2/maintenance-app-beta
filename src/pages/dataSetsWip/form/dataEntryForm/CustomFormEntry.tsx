import { useDataEngine } from '@dhis2/app-runtime'
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
import { StandardFormSectionTitle, DrawerPortal } from '../../../../components'
import { parseErrorResponse } from '../../../../lib'
import { CustomFormContents } from './CustomFormContents'
import css from './CustomFormContents.module.css'

// delete: we delete the form by form id
const useDeleteForm = ({
    id,
    onComplete,
}: {
    id: string
    onComplete: () => void
}) => {
    const dataEngine = useDataEngine()

    const deleteForm = useCallback(async () => {
        try {
            // const options = id ? {variables: {id}} : null
            const response = await dataEngine.mutate(
                {
                    resource: `dataEntryForms`,
                    type: 'delete',
                    id,
                },
                { onComplete }
            )
            return { data: response }
        } catch (error) {
            return { error: parseErrorResponse(error) }
        }
    }, [dataEngine, id, onComplete])
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

export const CustomFormEntry = () => {
    const [customFormEditOpen, setCustomFormEditOpen] =
        React.useState<boolean>(false)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] =
        useState<boolean>(false)
    const closeDeleteConfirmationModal = useCallback(() => {
        setDeleteConfirmationOpen(false)
    }, [setDeleteConfirmationOpen])
    const { input: formInput } = useField('dataEntryForm')
    const clearForm = () => {
        formInput.onChange({ ...formInput.value, htmlCode: '' })
    }
    const deleteCustomForm = useDeleteForm({
        id: formInput?.value?.id ?? '',
        onComplete: clearForm,
    })

    //
    const { input: controlledFormTypeInput } = useField('formType')

    return (
        <div className={css.customFormEntry}>
            {deleteConfirmationOpen && (
                <DeleteModal
                    closeModal={closeDeleteConfirmationModal}
                    deleteCustomForm={async () => {
                        // TO DO: put this in separate function
                        await deleteCustomForm()
                        controlledFormTypeInput.onChange('DEFAULT')
                        closeDeleteConfirmationModal()
                    }}
                />
            )}
            <DrawerPortal
                isOpen={customFormEditOpen}
                onClose={() => setCustomFormEditOpen(false)}
            >
                {customFormEditOpen && (
                    // TO DO: need FormBase wrapper
                    <CustomFormContents
                        onCancel={() => setCustomFormEditOpen(false)}
                    />
                )}
            </DrawerPortal>
            <div>
                <StandardFormSectionTitle>
                    {i18n.t('Custom form')}
                </StandardFormSectionTitle>
                <p className={css.description}>
                    {i18n.t('This data set uses a custom form for data entry.')}
                </p>
            </div>
            <div>
                <ButtonStrip>
                    <Button
                        secondary
                        small
                        destructive
                        onClick={() => setDeleteConfirmationOpen(true)}
                    >
                        {i18n.t('Delete custom form')}
                    </Button>
                    <Button
                        secondary
                        small
                        onClick={() => setCustomFormEditOpen(true)}
                    >
                        {i18n.t('Edit custom form')}
                    </Button>
                </ButtonStrip>
            </div>
        </div>
    )
}
