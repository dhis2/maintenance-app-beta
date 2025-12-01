import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    SectionedFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    DrawerPortal,
} from '../../../../components'
import { useSchemaSectionHandleOrThrow } from '../../../../lib'
import { EditOrNewOptionForm, SubmittedOptionFormValues } from './OptionEdit'
import { OptionsListTable, DrawerState, OptionDetail } from './OptionsListTable'

const OptionListNewOrEdit = () => {
    const modelId = useParams().id as string
    const { input: optionsInput } = useField<OptionDetail[]>('options')
    const [optionsDrawerState, setOptionsDrawerState] = useState<DrawerState>({
        open: false,
        id: undefined,
    })
    const onSubmitted = (values: SubmittedOptionFormValues) => {
        const newOptions = [...optionsInput.value]

        const index = newOptions.findIndex((o) => o.id === values.id)
        newOptions.splice(index, 1)
        newOptions.splice(index, 0, values as OptionDetail)

        optionsInput.onChange(newOptions)
        setOptionsDrawerState({ open: false, id: undefined })
    }
    // options cannot be added until option set is saved
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
                onClose={() => {
                    setOptionsDrawerState({ open: false, id: undefined })
                }}
            >
                <>
                    <EditOrNewOptionForm
                        onSubmitted={onSubmitted}
                        option={optionsDrawerState?.id}
                        onCancel={() => {
                            setOptionsDrawerState({
                                open: false,
                                id: undefined,
                            })
                        }}
                    />
                </>
            </DrawerPortal>
            <OptionsListTable setOptionsDrawerState={setOptionsDrawerState} />
        </>
    )
}

export const OptionsListFormContents = React.memo(
    function OptionSetSetupFormContents({ name }: { name: string }) {
        useSchemaSectionHandleOrThrow()

        return (
            <>
                <SectionedFormSection name={name}>
                    <StandardFormSectionTitle>
                        {i18n.t('Options')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t('Define options for this option set')}
                    </StandardFormSectionDescription>
                    <OptionListNewOrEdit />
                </SectionedFormSection>
            </>
        )
    }
)
