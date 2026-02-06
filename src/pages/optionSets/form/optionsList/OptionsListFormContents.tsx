import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    DrawerFooter,
    SectionedFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    DrawerPortal,
} from '../../../../components'
import { useSchemaSectionHandleOrThrow } from '../../../../lib'
import {
    EditOrNewOptionForm,
    OptionFormActions,
    SubmittedOptionFormValues,
} from './OptionEdit'
import { OptionsListTable, DrawerState, OptionDetail } from './OptionsListTable'

const OptionListNewOrEdit = () => {
    const modelId = useParams().id as string
    const { input: optionsInput } = useField<OptionDetail[]>('options')
    const { show } = useAlert(
        ({ isNew }) =>
            isNew ? i18n.t('Option created') : i18n.t('Option updated'),
        { success: true }
    )
    const [optionsDrawerState, setOptionsDrawerState] = useState<DrawerState>({
        open: false,
        id: undefined,
    })
    const [formActions, setFormActions] = useState<OptionFormActions | null>(
        null
    )

    const onSubmitted = (values: SubmittedOptionFormValues) => {
        const newOptions = [...optionsInput.value]

        const index = newOptions.findIndex((o) => o.id === values.id)
        if (index === -1) {
            newOptions.push(values as OptionDetail)
        } else {
            newOptions.splice(index, 1)
            newOptions.splice(index, 0, values as OptionDetail)
        }

        optionsInput.onChange(newOptions)
        show({ isNew: index === -1 })
        setOptionsDrawerState({ open: false, id: undefined })
    }

    const onCloseOptionForm = () => {
        setOptionsDrawerState({ open: false, id: undefined })
        setFormActions(null)
    }

    const optionFormFooter = formActions && (
        <DrawerFooter
            actions={[
                {
                    label: i18n.t('Save option'),
                    onClick: formActions.save,
                    primary: true,
                    disabled: formActions.submitting,
                    loading: formActions.submitting,
                },
                {
                    label: i18n.t('Cancel'),
                    onClick: onCloseOptionForm,
                    secondary: true,
                    disabled: formActions.submitting,
                },
            ]}
            infoMessage={i18n.t(
                'Saving an option does not save other changes to the option set'
            )}
        />
    )

    if (!modelId) {
        return (
            <NoticeBox>
                {i18n.t('Option set must be saved before options can be added')}
            </NoticeBox>
        )
    }
    return (
        <>
            <DrawerPortal
                isOpen={optionsDrawerState.open}
                onClose={onCloseOptionForm}
                header={
                    optionsDrawerState.id === undefined
                        ? i18n.t('New option')
                        : i18n.t('Edit option')
                }
                footer={optionFormFooter}
            >
                <EditOrNewOptionForm
                    onSubmitted={onSubmitted}
                    option={optionsDrawerState?.id}
                    onActionsReady={setFormActions}
                />
            </DrawerPortal>
            <OptionsListTable setOptionsDrawerState={setOptionsDrawerState} />
        </>
    )
}

export const OptionsListFormContents = React.memo(
    function OptionSetSetupFormContents({ name }: { name: string }) {
        useSchemaSectionHandleOrThrow()

        return (
            <SectionedFormSection name={name}>
                <StandardFormSectionTitle>
                    {i18n.t('Options')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Define options for this option set')}
                </StandardFormSectionDescription>
                <OptionListNewOrEdit />
            </SectionedFormSection>
        )
    }
)
