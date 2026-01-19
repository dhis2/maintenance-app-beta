import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { StandardFormSectionTitle, DrawerPortal } from '..'
import css from './CustomFormContents.module.css'
import { CustomFormEdit } from './CustomFormEdit'
import { ElementTypes } from './CustomFormElementsSelector'

export const CustomFormEditEntry = ({
    level,
    loading,
    elementTypes,
}: {
    level: 'primary' | 'secondary'
    loading: boolean
    elementTypes: ElementTypes
}) => {
    const [customFormEditOpen, setCustomFormEditOpen] =
        React.useState<boolean>(false)

    const { input: formInput } = useField('dataEntryForm')
    const addMode = !formInput?.value?.id // if there is no formId, you need to add a form
    const formDeleted = formInput?.value?.deleted
    const setCustomFormDeletedState = (deleted: boolean) => {
        formInput.onChange({ ...formInput?.value, deleted })
    }

    return (
        <div className={css.customFormEntry}>
            <DrawerPortal
                isOpen={customFormEditOpen}
                onClose={() => setCustomFormEditOpen(false)}
                level={level}
            >
                {customFormEditOpen && (
                    <CustomFormEdit
                        closeCustomFormEdit={() => setCustomFormEditOpen(false)}
                        loading={loading}
                        elementTypes={elementTypes}
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
