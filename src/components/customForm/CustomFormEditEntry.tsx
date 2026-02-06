import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { DrawerFooter, StandardFormSectionTitle, DrawerPortal } from '..'
import css from './CustomFormContents.module.css'
import {
    CustomFormActions,
    CustomFormDataPayload,
    CustomFormEdit,
} from './CustomFormEdit'
import { ElementTypes } from './CustomFormElementsSelector'

export const CustomFormEditEntry = ({
    level,
    loading,
    refetch,
    elementTypes,
    updateCustomForm,
    customFormTarget,
}: {
    level: 'primary' | 'secondary'
    loading: boolean
    refetch: () => void
    elementTypes: ElementTypes
    updateCustomForm: (
        data: CustomFormDataPayload,
        onSuccess: (data: CustomFormDataPayload) => void,
        onError: (e: Error) => void,
        existingFormId: string | undefined
    ) => Promise<unknown>
    customFormTarget: string
}) => {
    const [customFormEditOpen, setCustomFormEditOpen] = useState<boolean>(false)
    const [formActions, setFormActions] = useState<CustomFormActions | null>(
        null
    )

    const { input: formInput } = useField('dataEntryForm')
    const addMode = !formInput?.value?.id
    const formDeleted = formInput?.value?.deleted
    const setCustomFormDeletedState = (deleted: boolean) => {
        formInput.onChange({ ...formInput?.value, deleted })
    }

    const onCloseCustomFormEdit = () => {
        setCustomFormEditOpen(false)
        setFormActions(null)
    }

    const customFormFooter = formActions && (
        <DrawerFooter
            actions={[
                {
                    label: i18n.t('Save custom form'),
                    onClick: formActions.save,
                    primary: true,
                    disabled: formActions.saving,
                    loading: formActions.saving,
                },
                {
                    label: i18n.t('Cancel'),
                    onClick: onCloseCustomFormEdit,
                    secondary: true,
                    disabled: formActions.saving,
                },
            ]}
            infoMessage={i18n.t(
                `Saving a custom form does not save other changes to the {{customFormTarget}}`,
                { customFormTarget }
            )}
        />
    )

    return (
        <div className={css.customFormEntry}>
            <DrawerPortal
                isOpen={customFormEditOpen}
                onClose={onCloseCustomFormEdit}
                level={level}
                header={i18n.t('Custom form')}
                footer={customFormFooter}
            >
                {customFormEditOpen && (
                    <CustomFormEdit
                        loading={loading}
                        refetch={refetch}
                        elementTypes={elementTypes}
                        updateCustomForm={updateCustomForm}
                        customFormTarget={customFormTarget}
                        onActionsReady={setFormActions}
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
                {formDeleted ? (
                    <div className={css.customFormCardDeleted}>
                        <div className={css.deletedCustomFormText}>
                            {i18n.t('Custom form will be removed on save')}
                        </div>

                        <Button
                            small
                            onClick={() => setCustomFormDeletedState(false)}
                        >
                            {i18n.t('Restore custom form')}
                        </Button>
                    </div>
                ) : (
                    <ButtonStrip>
                        {!addMode && (
                            <Button
                                secondary
                                small
                                destructive
                                onClick={() => setCustomFormDeletedState(true)}
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
                )}
            </div>
        </div>
    )
}
